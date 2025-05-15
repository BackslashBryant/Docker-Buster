from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch, MagicMock
import json
from io import BytesIO

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
        assert "risk_score" in data
        assert "cve_count" in data
        assert "license_violations" in data
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
    assert "Report not found" in response.json()["detail"]

# Edge case: simulate image with no vulnerabilities
def test_report_no_vulnerabilities():
    with patch("main.process_docker_image") as mock_proc:
        mock_proc.return_value = {
            "report_id": "mock-id",
            "risk_score": 0.0,
            "cve_count": 0,
            "license_violations": 0,
            "manifest_sha256": "mocksha",
            "signature": "mocksig"
        }
        response = client.post("/report", json={"image": "alpine:latest"})
        assert response.status_code == 200
        data = response.json()
        assert data["cve_count"] == 0
        assert data["risk_score"] == 0.0

# Edge case: simulate large image (mock, not actual large image)
def test_report_large_image():
    with patch("main.process_docker_image") as mock_proc:
        mock_proc.return_value = {
            "report_id": "large-id",
            "risk_score": 5.0,
            "cve_count": 1000,
            "license_violations": 10,
            "manifest_sha256": "largesha",
            "signature": "largesig"
        }
        response = client.post("/report", json={"image": "large-image:latest"})
        assert response.status_code == 200
        data = response.json()
        assert data["cve_count"] == 1000
        assert data["license_violations"] == 10
