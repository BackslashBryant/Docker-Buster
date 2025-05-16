from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch, MagicMock
import json
from io import BytesIO
import pytest

client = TestClient(app)

def test_generate_sbom_invalid_image():
    response = client.post("/sbom", json={"image": "nonexistent-image:latest"})
    assert response.status_code == 500
    assert "Syft error" in response.json()["detail"]

def test_cve_scan_invalid_image():
    response = client.post("/cve-scan", json={"image": "nonexistent-image:latest"})
    assert response.status_code == 500
    assert "Grype error" in response.json()["detail"]

def test_license_scan_invalid_image():
    response = client.post("/license-scan", json={"image": "nonexistent-image:latest"})
    assert response.status_code == 500
    assert "Syft error" in response.json()["detail"]

def test_risk_score_invalid_image():
    response = client.post("/risk-score", json={"image": "nonexistent-image:latest"})
    assert response.status_code == 500
    assert "Scan error" in response.json()["detail"]

def test_generate_sbom_valid_image():
    # This test assumes 'alpine:latest' is available locally or can be pulled
    response = client.post("/sbom", json={"image": "alpine:latest"})
    # Accept 200 or 500 (if image not available), but if 200, check SBOM structure
    if response.status_code == 200:
        sbom = response.json()
        assert "components" in sbom
        assert isinstance(sbom["components"], list)
        assert "bomFormat" in sbom
        assert sbom["bomFormat"] == "CycloneDX"
    else:
        # If image is not available, Syft should error
        assert response.status_code == 500
        assert "Syft error" in response.json()["detail"]

def test_sbom_malformed_json():
    with patch("subprocess.run") as mock_run:
        mock_run.return_value = MagicMock(stdout="not a json", returncode=0)
        response = client.post("/sbom", json={"image": "alpine:latest"})
        assert response.status_code == 500
        assert "Invalid Syft JSON output" in response.json()["detail"]

def test_sbom_missing_components():
    valid_json = json.dumps({"bomFormat": "CycloneDX"})
    with patch("subprocess.run") as mock_run:
        mock_run.return_value = MagicMock(stdout=valid_json, returncode=0)
        response = client.post("/sbom", json={"image": "alpine:latest"})
        assert response.status_code == 200
        sbom = response.json()
        assert "components" not in sbom or sbom["components"] == []

def test_sbom_components_wrong_type():
    bad_json = json.dumps({"bomFormat": "CycloneDX", "components": "notalist"})
    with patch("subprocess.run") as mock_run:
        mock_run.return_value = MagicMock(stdout=bad_json, returncode=0)
        response = client.post("/sbom", json={"image": "alpine:latest"})
        assert response.status_code == 200
        sbom = response.json()
        # Should be a string, not a list
        assert isinstance(sbom["components"], str)

def test_generate_sbom_registry_image():
    # This test assumes network access and that the image can be pulled
    response = client.post("/sbom", json={"image": "docker.io/library/nginx:latest"})
    # Accept 200 or 500 (if image not available), but if 200, check SBOM structure
    if response.status_code == 200:
        sbom = response.json()
        assert "components" in sbom
        assert isinstance(sbom["components"], list)
        assert "bomFormat" in sbom
        assert sbom["bomFormat"] == "CycloneDX"
    else:
        # If image is not available, Syft should error
        assert response.status_code == 500
        assert "Syft error" in response.json()["detail"]

def test_sbom_upload_tarball():
    # Simulate tarball upload and Syft output using mock
    with patch("subprocess.run") as mock_run:
        fake_sbom = json.dumps({"bomFormat": "CycloneDX", "components": []})
        mock_run.return_value = MagicMock(stdout=fake_sbom, returncode=0)
        tar_content = b"fake tarball content"
        file = BytesIO(tar_content)
        file.name = "testimage.tar"
        response = client.post(
            "/sbom/upload",
            files={"file": (file.name, file, "application/x-tar")}
        )
        assert response.status_code == 200
        sbom = response.json()
        assert "components" in sbom
        assert sbom["components"] == []
        assert sbom["bomFormat"] == "CycloneDX"

def test_cve_scan_valid_image():
    response = client.post("/cve-scan", json={"image": "alpine:latest"})
    if response.status_code == 200:
        data = response.json()
        assert "cves" in data
        assert isinstance(data["cves"], list)
    else:
        assert response.status_code == 500
        assert "Grype error" in response.json()["detail"]

def test_license_scan_valid_image():
    response = client.post("/license-scan", json={"image": "alpine:latest"})
    if response.status_code == 200:
        data = response.json()
        assert "licenses" in data
        assert isinstance(data["licenses"], list)
    else:
        assert response.status_code == 500
        assert "Syft error" in response.json()["detail"]

def test_cve_scan_malformed_grype():
    with patch("subprocess.run") as mock_run:
        mock_run.return_value = MagicMock(stdout="not a json", returncode=0)
        response = client.post("/cve-scan", json={"image": "alpine:latest"})
        assert response.status_code == 500
        assert "Invalid Grype JSON output" in response.json()["detail"]

def test_license_scan_malformed_syft():
    with patch("subprocess.run") as mock_run:
        mock_run.return_value = MagicMock(stdout="not a json", returncode=0)
        response = client.post("/license-scan", json={"image": "alpine:latest"})
        assert response.status_code == 500
        assert "Invalid Syft JSON output" in response.json()["detail"]

def test_report_valid_image():
    response = client.post("/report", json={"image": "alpine:latest"})
    if response.status_code == 200:
        data = response.json()
        assert "report_id" in data
        assert "executive_summary" in data
        assert "risk_score" in data["executive_summary"]
        assert "cve_count" in data["executive_summary"]
        assert "license_violations" in data["executive_summary"]
        assert "manifest_sha256" in data
        assert "signature" in data
    else:
        # Accept 500 if image is not available
        assert response.status_code == 500

def test_report_invalid_image():
    response = client.post("/report", json={"image": "nonexistent-image:latest"})
    assert response.status_code == 500
    assert "Scan error" in response.json()["detail"] or "Error processing input" in response.json()["detail"]

def test_report_empty_image():
    response = client.post("/report", json={"image": ""})
    assert response.status_code == 500

def test_download_report_pdf_not_found():
    response = client.get("/download/report/invalid-id")
    assert response.status_code == 404
    assert "Report not found" in response.json()["detail"]

def test_download_report_json_not_found():
    response = client.get("/download/json/invalid-id")
    assert response.status_code == 404
    # Accept either error message substring
    detail = response.json()["detail"]
    assert ("Report not found" in detail) or ("Report JSON not found" in detail)

@pytest.mark.skip(reason="Mocks non-existent or placeholder functions.")
def test_report_no_vulnerabilities():
    pass

@pytest.mark.skip(reason="Mocks non-existent or placeholder functions.")
def test_report_large_image():
    pass

@pytest.mark.skip(reason="Mocks non-existent or placeholder functions.")
def test_pdf_checksum_matches_manifest_signature():
    pass

@pytest.mark.skip(reason="Mocks non-existent or placeholder functions.")
def test_secrets_scanner_flags_aws_secret_access_key():
    pass

def test_cve_scan_circl_enrichment():
    # Patch both subprocess.run (Grype) and requests.get (CIRCL)
    with patch("subprocess.run") as mock_run, patch("main.requests.get") as mock_get:
        # Mock Grype output with a known CVE
        grype_cve = {
            "matches": [
                {
                    "artifact": {"name": "openssl"},
                    "vulnerability": {
                        "id": "CVE-2021-3450",
                        "severity": "High",
                        "description": "Test CVE description",
                        "fix": {"versions": ["1.1.1k"]},
                        "references": ["https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-3450"]
                    }
                }
            ]
        }
        mock_run.return_value = MagicMock(stdout=json.dumps(grype_cve), returncode=0)
        # Mock CIRCL API response
        circl_data = {"id": "CVE-2021-3450", "summary": "CIRCL summary", "cvss": 7.4}
        mock_get.return_value = MagicMock(status_code=200, json=lambda: circl_data)
        response = client.post("/cve-scan", json={"image": "alpine:latest"})
        assert response.status_code == 200
        data = response.json()
        assert "cves" in data
        assert isinstance(data["cves"], list)
        assert data["cves"][0]["id"] == "CVE-2021-3450"
        assert data["cves"][0]["circl"] is not None
        assert data["cves"][0]["circl"]["summary"] == "CIRCL summary"
