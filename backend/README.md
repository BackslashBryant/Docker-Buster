# Docker Buster Backend

## SBOM Generation API

### Setup

1. Install requirements:
   ```sh
   pip install -r requirements.txt
   ```
2. Ensure [Syft](https://github.com/anchore/syft) is installed and available in your PATH.

### Run the API

```sh
uvicorn main:app --reload
```

### Usage

POST `/sbom`
- Body: `{ "image": "<docker-image-name>" }`
- Returns: CycloneDX JSON SBOM or error

### Example
```sh
curl -X POST http://localhost:8000/sbom -H "Content-Type: application/json" -d '{"image": "alpine:latest"}'
```
