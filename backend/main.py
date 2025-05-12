from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess
import json

app = FastAPI()

class SBOMRequest(BaseModel):
    image: str

@app.post("/sbom")
def generate_sbom(req: SBOMRequest):
    try:
        result = subprocess.run(
            ["syft", req.image, "-o", "cyclonedx-json"],
            capture_output=True, text=True, check=True
        )
        sbom = json.loads(result.stdout)
        return {"sbom": sbom}
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Syft error: {e.stderr}")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid SBOM JSON output.")

class CVEScanRequest(BaseModel):
    image: str

@app.post("/cve-scan")
def cve_scan(req: CVEScanRequest):
    try:
        result = subprocess.run(
            ["grype", req.image, "-o", "json"],
            capture_output=True, text=True, check=True
        )
        grype_output = json.loads(result.stdout)
        # Filter only Critical & High CVEs
        matches = grype_output.get("matches", [])
        filtered = [
            {
                "vuln_id": m["vulnerability"]["id"],
                "severity": m["vulnerability"]["severity"],
                "package": m["artifact"]["name"],
                "version": m["artifact"]["version"]
            }
            for m in matches if m["vulnerability"]["severity"] in ("Critical", "High")
        ]
        return {"cves": filtered}
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Grype error: {e.stderr}")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid Grype JSON output.")

class LicenseScanRequest(BaseModel):
    image: str

@app.post("/license-scan")
def license_scan(req: LicenseScanRequest):
    try:
        result = subprocess.run(
            ["syft", req.image, "-o", "cyclonedx-json"],
            capture_output=True, text=True, check=True
        )
        sbom = json.loads(result.stdout)
        components = sbom.get("components", [])
        licenses = set()
        for comp in components:
            lic_info = comp.get("licenses", [])
            for lic in lic_info:
                lic_id = lic.get("license", {}).get("id")
                if lic_id:
                    licenses.add(lic_id)
        return {"spdx_licenses": sorted(list(licenses))}
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Syft error: {e.stderr}")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid SBOM JSON output.")

class RiskScoreRequest(BaseModel):
    image: str

@app.post("/risk-score")
def risk_score(req: RiskScoreRequest):
    try:
        # Run Grype for CVEs
        grype_result = subprocess.run(
            ["grype", req.image, "-o", "json"],
            capture_output=True, text=True, check=True
        )
        grype_output = json.loads(grype_result.stdout)
        matches = grype_output.get("matches", [])
        # Count CVEs by severity
        cve_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
        for m in matches:
            sev = m["vulnerability"]["severity"]
            if sev in cve_counts:
                cve_counts[sev] += 1
        # Run Syft for secrets/config hygiene (simple env var check)
        syft_result = subprocess.run(
            ["syft", req.image, "-o", "cyclonedx-json"],
            capture_output=True, text=True, check=True
        )
        sbom = json.loads(syft_result.stdout)
        secrets_found = False
        for comp in sbom.get("components", []):
            envs = comp.get("properties", [])
            for prop in envs:
                if prop.get("name", "").upper() in ["AWS_SECRET_ACCESS_KEY", "SECRET_KEY", "API_KEY"]:
                    secrets_found = True
        # Weighted score: Critical=5, High=3, Medium=1, Low=0.5, secrets=10
        score = (
            cve_counts["Critical"] * 5 +
            cve_counts["High"] * 3 +
            cve_counts["Medium"] * 1 +
            cve_counts["Low"] * 0.5 +
            (10 if secrets_found else 0)
        )
        return {
            "risk_score": score,
            "cve_counts": cve_counts,
            "secrets_found": secrets_found
        }
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Scan error: {e.stderr}")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid scan JSON output.")
