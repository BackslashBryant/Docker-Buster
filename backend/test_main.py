from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_generate_sbom_invalid_image():
    response = client.post("/sbom", json={"image": "nonexistent-image:latest"})
    assert response.status_code == 500
    assert "Syft error" in response.json()["detail"]
