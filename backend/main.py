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
