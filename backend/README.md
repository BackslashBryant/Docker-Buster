# Docker Buster Backend

## SBOM Generation API

### Setup

1. Install requirements:
   ```sh
   pip install -r requirements.txt
   ```
2. Ensure [Syft](https://github.com/anchore/syft) and [Grype](https://github.com/anchore/grype) are installed and available in your PATH.

### Run the API

```sh
uvicorn main:app --reload
```

### Usage

POST `/sbom`
- Body: `{ "image": "<docker-image-name>" }`
- Returns: CycloneDX JSON SBOM or error

POST `/cve-scan`
- Body: `{ "image": "<docker-image-name>" }`
- Returns: List of Critical & High CVEs

POST `/license-scan`
- Body: `{ "image": "<docker-image-name>" }`
- Returns: List of unique SPDX license IDs found in the image

POST `/risk-score`
- Body: `{ "image": "<docker-image-name>" }`
- Returns: Weighted risk score, CVE counts, and secrets detection

### Example
```sh
curl -X POST http://localhost:8000/sbom -H "Content-Type: application/json" -d '{"image": "alpine:latest"}'
curl -X POST http://localhost:8000/cve-scan -H "Content-Type: application/json" -d '{"image": "alpine:latest"}'
curl -X POST http://localhost:8000/license-scan -H "Content-Type: application/json" -d '{"image": "alpine:latest"}'
curl -X POST http://localhost:8000/risk-score -H "Content-Type: application/json" -d '{"image": "alpine:latest"}'
```
