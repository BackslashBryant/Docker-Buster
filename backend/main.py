from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
import subprocess
import json
import tempfile
import os
import hashlib
from weasyprint import HTML
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.serialization import load_pem_private_key
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend

app = FastAPI()

# ... previous endpoints ...

class ReportRequest(BaseModel):
    image: str

@app.post("/report")
def generate_report(req: ReportRequest):
    try:
        # 1. Generate SBOM
        syft_result = subprocess.run(
            ["syft", req.image, "-o", "cyclonedx-json"],
            capture_output=True, text=True, check=True
        )
        sbom = json.loads(syft_result.stdout)
        # 2. Run Grype for CVEs
        grype_result = subprocess.run(
            ["grype", req.image, "-o", "json"],
            capture_output=True, text=True, check=True
        )
        grype_output = json.loads(grype_result.stdout)
        # 3. Risk Score
        matches = grype_output.get("matches", [])
        cve_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
        for m in matches:
            sev = m["vulnerability"]["severity"]
            if sev in cve_counts:
                cve_counts[sev] += 1
        secrets_found = False
        for comp in sbom.get("components", []):
            envs = comp.get("properties", [])
            for prop in envs:
                if prop.get("name", "").upper() in ["AWS_SECRET_ACCESS_KEY", "SECRET_KEY", "API_KEY"]:
                    secrets_found = True
        score = (
            cve_counts["Critical"] * 5 +
            cve_counts["High"] * 3 +
            cve_counts["Medium"] * 1 +
            cve_counts["Low"] * 0.5 +
            (10 if secrets_found else 0)
        )
        # 4. Prepare JSON bundle
        bundle = {
            "sbom": sbom,
            "cve_scan": grype_output,
            "risk_score": score,
            "cve_counts": cve_counts,
            "secrets_found": secrets_found
        }
        with tempfile.TemporaryDirectory() as tmpdir:
            json_path = os.path.join(tmpdir, "report.json")
            pdf_path = os.path.join(tmpdir, "report.pdf")
            manifest_path = os.path.join(tmpdir, "manifest.sha256")
            sig_path = os.path.join(tmpdir, "manifest.sig")
            # Write JSON
            with open(json_path, "w") as f:
                json.dump(bundle, f, indent=2)
            # 5. Generate HTML for PDF
            html = f"""
            <h1>Docker Buster Report</h1>
            <h2>Image: {req.image}</h2>
            <h3>Risk Score: {score}</h3>
            <h4>CVEs</h4>
            <pre>{json.dumps(cve_counts, indent=2)}</pre>
            <h4>Secrets Found: {secrets_found}</h4>
            <h4>SBOM (truncated)</h4>
            <pre>{json.dumps(sbom, indent=2)[:2000]}...</pre>
            """
            HTML(string=html).write_pdf(pdf_path)
            # 6. SHA-256 manifest
            sha256 = hashlib.sha256()
            for path in [json_path, pdf_path]:
                with open(path, "rb") as f:
                    sha256.update(f.read())
            manifest = sha256.hexdigest()
            with open(manifest_path, "w") as f:
                f.write(manifest)
            # 7. Detached signature (generate ephemeral key for demo)
            private_key = rsa.generate_private_key(
                public_exponent=65537,
                key_size=2048,
                backend=default_backend()
            )
            signature = private_key.sign(
                manifest.encode(),
                padding.PKCS1v15(),
                hashes.SHA256()
            )
            with open(sig_path, "wb") as f:
                f.write(signature)
            # 8. Return files as download links (for demo, just return manifest and signature)
            with open(manifest_path, "r") as f:
                manifest_val = f.read()
            return {
                "risk_score": score,
                "manifest_sha256": manifest_val,
                "signature": signature.hex(),
                "note": "PDF and JSON files generated in temp dir (demo mode)"
            }
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Scan error: {e.stderr}")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid scan JSON output.")
