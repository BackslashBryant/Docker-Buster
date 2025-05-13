# Docker Buster Backend

## SBOM Generation API

### Setup

1. Install requirements:
   ```sh
   pip install --user -r requirements.txt
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

POST `/report`
- Body: `{ "image": "<docker-image-name>" }`
- Returns: Rich JSON report (see below), plus PDF/JSON files in the reports directory, with manifest and signature.

#### Example `/report` Response
```json
{
  "report_id": "<uuid>",
  "api_version": "1.0",
  "generated_at": "2024-05-13T12:34:56Z",
  "image": {
    "name": "alpine:latest",
    "digest": "sha256:...",
    "size": 7829416,
    "os": "linux",
    "architecture": "amd64"
  },
  "executive_summary": {
    "risk_score": 7.5,
    "risk_level": "MODERATE",
    "cve_count": 12,
    "cve_counts": { "Critical": 2, "High": 5, "Medium": 3, "Low": 2 },
    "license_violations": 1,
    "secrets_found": false,
    "components_count": 34
  },
  "components": [
    {
      "name": "openssl",
      "version": "1.1.1k",
      "type": "library",
      "origin": "pkg:apk/alpine/openssl@1.1.1k",
      "maintainer": "Alpine Linux Team",
      "licenses": ["OpenSSL"],
      "vulnerabilities": [
        {
          "id": "CVE-2021-3450",
          "severity": "High",
          "description": "OpenSSL vulnerability description...",
          "fix_version": "1.1.1l",
          "references": ["https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-3450"]
        }
      ]
    }
    // ... more components ...
  ],
  "remediation": {
    "steps": [
      "Update vulnerable packages to their latest versions",
      "Review and resolve license compliance issues",
      "Implement proper secrets management practices"
    ],
    "upgrade_recommendations": [
      {
        "component": "openssl",
        "current_version": "1.1.1k",
        "recommended_version": "1.1.1l",
        "priority": "High"
      }
    ],
    "config_suggestions": [
      "Avoid running containers as root",
      "Use multi-stage builds to reduce image size"
    ],
    "best_practices": [
      "Never hardcode secrets in Dockerfiles or environment variables",
      "Keep your base images updated"
    ]
  },
  "manifest_sha256": "<sha256>",
  "signature": "<hex>"
}
```

### Download Endpoints
- `GET /download/report/{report_id}` — Download PDF report
- `GET /download/json/{report_id}` — Download JSON report

### Notes
- The `/report` endpoint now returns a detailed, actionable JSON structure for use in UI/automation.
- Remediation, upgrade, and best practices fields are populated with real or mock data as available.
- See tickets.md for planned frontend and PDF/UX enhancements.
