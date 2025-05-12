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
