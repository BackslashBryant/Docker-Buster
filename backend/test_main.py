from fastapi.testclient import TestClient
from main import app

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
