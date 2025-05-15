from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import json
import tempfile
import os
import hashlib
import uuid
import shutil
import re
from weasyprint import HTML
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.serialization import load_pem_private_key
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
from datetime import datetime

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create reports directory
REPORTS_DIR = "reports"
os.makedirs(REPORTS_DIR, exist_ok=True)

# Parse different input types
def parse_input(input_str):
    # Docker image tag format (e.g., alpine:latest, docker.io/library/nginx:1.19)
    docker_pattern = r"^(([a-z0-9]+([-._][a-z0-9]+)*(/[a-z0-9]+([-._][a-z0-9]+)*)*))?([a-z0-9]+.*)(:[a-z0-9._-]+)?$"
    
    # Git repo format (e.g., github.com/user/repo)
    git_pattern = r"^(github\.com|gitlab\.com|bitbucket\.org)/[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+(/.*)?$"
    
    # URL format (e.g., https://example.com/path)
    url_pattern = r"^(https?|ftp)://[^\s/$.?#].[^\s]*$"
    
    if re.match(docker_pattern, input_str):
        # Handle Docker image
        return {"type": "docker", "value": input_str}
    elif re.match(git_pattern, input_str):
        # Handle Git repo
        # For demonstration, we'll prepend https:// if not already present
        if not input_str.startswith(("http://", "https://")):
            input_str = f"https://{input_str}"
        return {"type": "git", "value": input_str}
    elif re.match(url_pattern, input_str):
        # Handle URL
        return {"type": "url", "value": input_str}
    else:
        # Default to treating it as a Docker image
        return {"type": "docker", "value": input_str}

# ... previous endpoints ...

class ReportRequest(BaseModel):
    image: str

class ScanRequest(BaseModel):
    image: str

@app.post("/report")
def generate_report(req: ReportRequest):
    try:
        # Parse the input
        parsed_input = parse_input(req.image)
        input_type = parsed_input["type"]
        input_value = parsed_input["value"]
        
        # Generate report ID
        report_id = str(uuid.uuid4())
        report_dir = os.path.join(REPORTS_DIR, report_id)
        os.makedirs(report_dir, exist_ok=True)
        
        # Process based on input type
        if input_type == "docker":
            # Process Docker image
            return process_docker_image(input_value, report_dir, report_id)
        elif input_type == "git":
            # For demo purposes, we'll just return a simplified response for Git repos
            return {
                "report_id": report_id,
                "risk_score": 5.0,
                "cve_count": 0,
                "license_violations": 0,
                "manifest_sha256": hashlib.sha256(input_value.encode()).hexdigest(),
                "signature": "demo_signature_for_git_repo",
                "note": "Git repository scanning is a premium feature"
            }
        elif input_type == "url":
            # For demo purposes, we'll just return a simplified response for URLs
            return {
                "report_id": report_id,
                "risk_score": 3.0,
                "cve_count": 0,
                "license_violations": 0,
                "manifest_sha256": hashlib.sha256(input_value.encode()).hexdigest(),
                "signature": "demo_signature_for_url",
                "note": "URL scanning is a premium feature"
            }
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Scan error: {e.stderr}")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid scan JSON output.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing input: {str(e)}")

def process_docker_image(image, report_dir, report_id):
    # Suppress GLib-GIO-WARNING logs
    os.environ["G_MESSAGES_DEBUG"] = "none"
    try:
        # 1. Generate SBOM
        syft_result = subprocess.run(
            ["syft", image, "-o", "cyclonedx-json"],
            capture_output=True, text=True, check=True, encoding="utf-8", errors="replace"
        )
        sbom = json.loads(syft_result.stdout)
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Syft error: {e.stderr}\n{e.stdout}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Syft unexpected error: {str(e)}")

    try:
        # 2. Run Grype for CVEs
        grype_result = subprocess.run(
            ["grype", image, "-o", "json"],
            capture_output=True, text=True, check=True, encoding="utf-8", errors="replace"
        )
        grype_output = json.loads(grype_result.stdout)
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Grype error: {e.stderr}\n{e.stdout}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Grype unexpected error: {str(e)}")
    
    # 3. Risk Score
    matches = grype_output.get("matches", [])
    cve_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
    for m in matches:
        sev = m["vulnerability"]["severity"]
        if sev in cve_counts:
            cve_counts[sev] += 1
            
    # Calculate total CVE count
    cve_count = sum(cve_counts.values())
    
    # Check for license issues
    license_violations = 0
    for comp in sbom.get("components", []):
        license_info = comp.get("licenses", [])
        for lic in license_info:
            expression = lic.get("expression", "")
            if "proprietary" in expression.lower() or "unknown" in expression.lower():
                license_violations += 1
    
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
        (license_violations * 2) +
        (10 if secrets_found else 0)
    )
    # Cap score at 10
    score = min(10, score)
    risk_level = "CRITICAL" if score > 7 else "MODERATE" if score > 3 else "LOW"
    
    # Image metadata (from SBOM or Grype source)
    image_meta = {
        "name": image,
        "digest": None,
        "size": None,
        "os": None,
        "architecture": None
    }
    source = grype_output.get("source", {})
    if source.get("type") == "image":
        target = source.get("target", {})
        image_meta["digest"] = target.get("imageID")
        image_meta["size"] = target.get("imageSize")
        image_meta["os"] = target.get("os")
        image_meta["architecture"] = target.get("architecture")

    # Executive summary
    executive_summary = {
        "risk_score": round(score, 1),
        "risk_level": risk_level,
        "cve_count": cve_count,
        "cve_counts": cve_counts,
        "license_violations": license_violations,
        "secrets_found": secrets_found,
        "components_count": len(sbom.get("components", []))
    }

    # Components with vulnerabilities
    components = []
    comp_index = {c.get("name", ""): c for c in sbom.get("components", [])}
    for comp in sbom.get("components", []):
        comp_vulns = []
        for m in matches:
            if m["artifact"]["name"] == comp.get("name"):
                vuln = m["vulnerability"]
                comp_vulns.append({
                    "id": vuln.get("id"),
                    "severity": vuln.get("severity"),
                    "description": vuln.get("description"),
                    "fix_version": vuln.get("fix", {}).get("versions", [None])[0] if vuln.get("fix", {}).get("versions") else None,
                    "references": vuln.get("references", [])
                })
        components.append({
            "name": comp.get("name"),
            "version": comp.get("version"),
            "type": comp.get("type"),
            "origin": comp.get("purl"),
            "maintainer": comp.get("supplier", {}).get("name") if comp.get("supplier") else None,
            "licenses": [l.get("expression") for l in comp.get("licenses", [])],
            "vulnerabilities": comp_vulns
        })

    # Remediation (mock/static for now)
    remediation = {
        "steps": [
            "Update vulnerable packages to their latest versions",
            "Review and resolve license compliance issues",
            "Implement proper secrets management practices",
            "Consider using minimal base images",
            "Regularly scan your containers for new vulnerabilities"
        ],
        "upgrade_recommendations": [
            {
                "component": m["artifact"]["name"],
                "current_version": m["artifact"]["version"],
                "recommended_version": "Latest",
                "priority": "High" if m["vulnerability"]["severity"] in ["Critical", "High"] else "Medium"
            }
            for m in matches[:3] if m["vulnerability"]["severity"] in ["Critical", "High"]
        ],
        "config_suggestions": [
            "Avoid running containers as root",
            "Use multi-stage builds to reduce image size"
        ],
        "best_practices": [
            "Never hardcode secrets in Dockerfiles or environment variables",
            "Keep your base images updated",
            "Implement image signing for supply chain security"
        ]
    }

    # Prepare final bundle
    bundle = {
        "report_id": report_id,
        "api_version": "1.0",
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "image": image_meta,
        "executive_summary": executive_summary,
        "components": components,
        "remediation": remediation
    }

    # Write JSON
    json_path = os.path.join(report_dir, "report.json")
    with open(json_path, "w") as f:
        json.dump(bundle, f, indent=2)
        
    # 5. Generate HTML for PDF
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Docker Buster Report - {image}</title>
        <style>
            body {{ 
                font-family: Arial, sans-serif; 
                line-height: 1.6;
                color: #f9fafb; 
                background-color: #041E37;
                margin: 0;
                padding: 20px;
            }}
            h1 {{ 
                color: #0F95D6; 
                border-bottom: 1px solid #0F95D6;
                padding-bottom: 10px;
            }}
            h2 {{ 
                color: #fff; 
                margin-top: 30px;
            }}
            h3 {{ 
                color: #0F95D6; 
                margin-top: 20px;
            }}
            .container {{
                max-width: 1000px;
                margin: 0 auto;
                padding: 20px;
            }}
            .card {{
                background-color: #071F35;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(15, 149, 214, 0.1);
            }}
            .executive-summary {{
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
            }}
            .score-card {{
                flex: 1;
                min-width: 250px;
                position: relative;
                padding-top: 30px;
            }}
            .score-circle {{
                width: 150px;
                height: 150px;
                border-radius: 50%;
                background: #071F35;
                border: 8px solid {
                    'rgba(239, 68, 68, 0.8)' if score > 7 else 
                    'rgba(245, 158, 11, 0.8)' if score > 3 else 
                    'rgba(16, 185, 129, 0.8)'
                };
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 48px;
                font-weight: bold;
                margin: 0 auto 20px;
                color: {
                    '#EF4444' if score > 7 else 
                    '#F59E0B' if score > 3 else 
                    '#10B981'
                };
                position: relative;
                box-shadow: 0 0 20px {
                    'rgba(239, 68, 68, 0.4)' if score > 7 else 
                    'rgba(245, 158, 11, 0.4)' if score > 3 else 
                    'rgba(16, 185, 129, 0.4)'
                };
            }}
            .score-label {{
                text-align: center;
                font-size: 18px;
                font-weight: bold;
                margin-top: 10px;
                color: {
                    '#EF4444' if score > 7 else 
                    '#F59E0B' if score > 3 else 
                    '#10B981'
                };
            }}
            .metrics-grid {{
                flex: 2;
                min-width: 300px;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 15px;
            }}
            .metric-card {{
                background-color: #102C45;
                border-radius: 6px;
                padding: 15px;
                text-align: center;
            }}
            .metric-value {{
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
            }}
            .metric-label {{
                font-size: 12px;
                color: #D1D5DB;
            }}
            .critical {{
                color: #EF4444;
            }}
            .high {{
                color: #F59E0B;
            }}
            .medium {{
                color: #3B82F6;
            }}
            .low {{
                color: #10B981;
            }}
            .severity-breakdown {{
                margin-top: 20px;
            }}
            .bar-chart {{
                display: flex;
                height: 20px;
                border-radius: 4px;
                overflow: hidden;
                margin-top: 10px;
            }}
            .bar {{
                height: 100%;
            }}
            .bar-critical {{ background-color: #EF4444; }}
            .bar-high {{ background-color: #F59E0B; }}
            .bar-medium {{ background-color: #3B82F6; }}
            .bar-low {{ background-color: #10B981; }}
            
            table {{
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }}
            table, th, td {{
                border: 1px solid #102C45;
            }}
            th, td {{
                padding: 10px;
                text-align: left;
            }}
            th {{
                background-color: #102C45;
                color: #0F95D6;
            }}
            
            .component-details {{
                margin-top: 30px;
            }}
            
            .license-info {{
                margin-top: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
            }}
            
            .license-status {{
                width: 15px;
                height: 15px;
                border-radius: 50%;
                display: inline-block;
            }}
            
            .license-compliant {{
                background-color: #10B981;
            }}
            
            .license-warning {{
                background-color: #F59E0B;
            }}
            
            .license-violation {{
                background-color: #EF4444;
            }}
            
            pre {{ 
                background: #102C45; 
                padding: 1em; 
                border-radius: 4px; 
                overflow-x: auto;
                color: #D1D5DB;
            }}
            
            .footer {{
                margin-top: 40px;
                font-size: 12px;
                color: #D1D5DB;
                text-align: center;
                border-top: 1px solid #102C45;
                padding-top: 20px;
            }}
            
            /* Add a lightning bolt symbol before headings */
            h2:before {{
                content: "⚡ ";
                color: #E53935;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Docker Buster Security Report</h1>
            
            <div class="card">
                <h2>Image Information</h2>
                <p><strong>Image:</strong> {image}</p>
                <p><strong>Scan ID:</strong> {report_id}</p>
                <p><strong>Scan Date:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            </div>
            
            <!-- Executive Summary Section -->
            <div class="card">
                <h2>Executive Summary</h2>
                
                <div class="executive-summary">
                    <div class="score-card">
                        <div class="score-circle">{score:.1f}</div>
                        <div class="score-label">{risk_level}</div>
                    </div>
                    
                    <div class="metrics-grid">
                        <div class="metric-card">
                            <div class="metric-value">{cve_count}</div>
                            <div class="metric-label">CVEs Found</div>
                        </div>
                        
                        <div class="metric-card">
                            <div class="metric-value">{license_violations}</div>
                            <div class="metric-label">License Issues</div>
                        </div>
                        
                        <div class="metric-card">
                            <div class="metric-value">{'Yes' if secrets_found else 'No'}</div>
                            <div class="metric-label">Secrets Detected</div>
                        </div>
                        
                        <div class="metric-card">
                            <div class="metric-value">{len(sbom.get('components', []))}</div>
                            <div class="metric-label">Components</div>
                        </div>
                    </div>
                </div>
                
                <!-- Severity Breakdown -->
                <div class="severity-breakdown">
                    <h3>Vulnerability Severity Breakdown</h3>
                    
                    <table>
                        <tr>
                            <th>Severity</th>
                            <th>Count</th>
                            <th>Description</th>
                        </tr>
                        <tr>
                            <td class="critical">Critical</td>
                            <td>{cve_counts['Critical']}</td>
                            <td>Vulnerabilities that require immediate attention</td>
                        </tr>
                        <tr>
                            <td class="high">High</td>
                            <td>{cve_counts['High']}</td>
                            <td>Vulnerabilities that should be prioritized</td>
                        </tr>
                        <tr>
                            <td class="medium">Medium</td>
                            <td>{cve_counts['Medium']}</td>
                            <td>Vulnerabilities that should be addressed</td>
                        </tr>
                        <tr>
                            <td class="low">Low</td>
                            <td>{cve_counts['Low']}</td>
                            <td>Low impact vulnerabilities</td>
                        </tr>
                    </table>
                    
                    <!-- Severity Bar Chart -->
                    <div class="bar-chart">
                        {f'<div class="bar bar-critical" style="width: {(cve_counts["Critical"]/max(1, cve_count))*100}%"></div>' if cve_counts["Critical"] > 0 else ''}
                        {f'<div class="bar bar-high" style="width: {(cve_counts["High"]/max(1, cve_count))*100}%"></div>' if cve_counts["High"] > 0 else ''}
                        {f'<div class="bar bar-medium" style="width: {(cve_counts["Medium"]/max(1, cve_count))*100}%"></div>' if cve_counts["Medium"] > 0 else ''}
                        {f'<div class="bar bar-low" style="width: {(cve_counts["Low"]/max(1, cve_count))*100}%"></div>' if cve_counts["Low"] > 0 else ''}
                    </div>
                </div>
                
                <!-- License Status -->
                <div class="license-info">
                    <span class="license-status {'license-compliant' if license_violations == 0 else 'license-violation'}"></span>
                    <strong>License Compliance:</strong> 
                    {
                        'No license issues detected' if license_violations == 0 else 
                        f'{license_violations} license violation{"s" if license_violations > 1 else ""} detected'
                    }
                </div>
            </div>
            
            <!-- Component Details Section -->
            <div class="card component-details">
                <h2>Component Details</h2>
                
                <h3>SBOM Summary</h3>
                <p>This image contains {len(sbom.get('components', []))} components.</p>
                
                {
                    f"""
                    <h3>Top Vulnerable Components</h3>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Version</th>
                            <th>Critical</th>
                            <th>High</th>
                            <th>Total</th>
                        </tr>
                        {"".join([
                            f"<tr><td>{match['artifact']['name']}</td><td>{match['artifact']['version']}</td><td>{len([v for v in matches if v['artifact']['name'] == match['artifact']['name'] and v['vulnerability']['severity'] == 'Critical'])}</td><td>{len([v for v in matches if v['artifact']['name'] == match['artifact']['name'] and v['vulnerability']['severity'] == 'High'])}</td><td>{len([v for v in matches if v['artifact']['name'] == match['artifact']['name']])}</td></tr>"
                            for match in matches[:5] if len(matches) > 0
                        ])}
                    </table>
                    """ if cve_count > 0 else "<p>No vulnerabilities found.</p>"
                }
            </div>
            
            <!-- Actionable Insights Section -->
            <div class="card">
                <h2>Actionable Insights</h2>
                
                {
                    f"""
                    <h3>Recommended Actions</h3>
                    <ol>
                        <li>Update vulnerable packages to their latest versions</li>
                        <li>Review and resolve license compliance issues</li>
                        <li>Implement proper secrets management practices</li>
                        <li>Consider using minimal base images</li>
                        <li>Regularly scan your containers for new vulnerabilities</li>
                    </ol>
                    """
                }
                
                {
                    f"""
                    <h3>Upgrade Recommendations</h3>
                    <table>
                        <tr>
                            <th>Component</th>
                            <th>Current Version</th>
                            <th>Recommended Version</th>
                            <th>Priority</th>
                        </tr>
                        {"".join([
                            f"<tr><td>{match['artifact']['name']}</td><td>{match['artifact']['version']}</td><td>Latest</td><td>{'High' if match['vulnerability']['severity'] in ['Critical', 'High'] else 'Medium'}</td></tr>"
                            for match in matches[:3] if len(matches) > 0 and match['vulnerability']['severity'] in ['Critical', 'High']
                        ])}
                    </table>
                    """ if cve_count > 0 else "<p>No upgrades needed at this time.</p>"
                }
                
                {
                    "<h3>Security Best Practices</h3>" +
                    ("<ul>" +
                    "<li>Use multi-stage builds to reduce image size and attack surface</li>" +
                    "<li>Avoid running containers as root</li>" +
                    "<li>Never hardcode secrets in Dockerfiles or environment variables</li>" +
                    "<li>Keep your base images updated</li>" +
                    "<li>Implement image signing for supply chain security</li>" +
                    "</ul>")
                }
            </div>
            
            <!-- Manifest Verification -->
            <div class="card">
                <h2>Verification Information</h2>
                <p><strong>SHA-256:</strong> {hashlib.sha256(json.dumps(bundle, sort_keys=True).encode()).hexdigest()}</p>
            </div>
            
            <div class="footer">
                <p>Generated by Docker Buster | Report ID: {report_id}</p>
                <p>© {datetime.now().year} Docker Buster - Powered by Advanced Container Security</p>
            </div>
        </div>
    </body>
    </html>
    """
    pdf_path = os.path.join(report_dir, "report.pdf")
    # Add headless mode for WeasyPrint if available
    weasyprint_kwargs = {}
    if os.environ.get("WEASYPRINT_HEADLESS", "false").lower() == "true":
        weasyprint_kwargs["presentational_hints"] = True  # No real headless mode, but placeholder for future
    HTML(string=html).write_pdf(pdf_path, **weasyprint_kwargs)
    
    # 6. SHA-256 manifest
    sha256 = hashlib.sha256()
    for path in [json_path, pdf_path]:
        with open(path, "rb") as f:
            sha256.update(f.read())
    manifest = sha256.hexdigest()
    with open(os.path.join(report_dir, "manifest.sha256"), "w") as f:
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
    with open(os.path.join(report_dir, "manifest.sig"), "wb") as f:
        f.write(signature)
        
    # 8. Return files as download links
    bundle["manifest_sha256"] = manifest
    bundle["signature"] = signature.hex()
    return bundle

@app.get("/download/report/{report_id}")
def download_report(report_id: str):
    pdf_path = os.path.join(REPORTS_DIR, report_id, "report.pdf")
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="Report not found")
    return FileResponse(pdf_path, filename=f"docker-buster-report-{report_id}.pdf")

@app.get("/download/json/{report_id}")
def download_json(report_id: str):
    json_path = os.path.join(REPORTS_DIR, report_id, "report.json")
    if not os.path.exists(json_path):
        raise HTTPException(status_code=404, detail="Report JSON not found")
    return FileResponse(json_path, filename=f"docker-buster-report-{report_id}.json")

@app.get("/report/{report_id}/status")
def get_report_status(report_id: str):
    """
    Check the status of a report generation process.
    Returns whether all the necessary files have been generated.
    """
    report_dir = os.path.join(REPORTS_DIR, report_id)
    if not os.path.exists(report_dir):
        raise HTTPException(status_code=404, detail="Report not found")
        
    json_path = os.path.join(report_dir, "report.json")
    pdf_path = os.path.join(report_dir, "report.pdf")
    manifest_path = os.path.join(report_dir, "manifest.sha256")
    sig_path = os.path.join(report_dir, "manifest.sig")
    
    # Check if all output files exist
    files_ready = all(os.path.exists(p) for p in [json_path, pdf_path, manifest_path, sig_path])
    
    return {
        "report_id": report_id,
        "status": "ready" if files_ready else "processing",
        "files": {
            "json": os.path.exists(json_path),
            "pdf": os.path.exists(pdf_path),
            "manifest": os.path.exists(manifest_path),
            "signature": os.path.exists(sig_path)
        }
    }

@app.post("/cve-scan")
def cve_scan(req: ScanRequest):
    try:
        # Run Grype for CVEs
        grype_result = subprocess.run(
            ["grype", req.image, "-o", "json"],
            capture_output=True, text=True, check=True
        )
        grype_output = json.loads(grype_result.stdout)
        matches = grype_output.get("matches", [])
        cves = [
            {
                "id": m["vulnerability"].get("id"),
                "severity": m["vulnerability"].get("severity"),
                "description": m["vulnerability"].get("description"),
                "fix_version": m["vulnerability"].get("fix", {}).get("versions", [None])[0] if m["vulnerability"].get("fix", {}).get("versions") else None
            }
            for m in matches
        ]
        return {"cves": cves}
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Grype error: {e.stderr}")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid Grype JSON output.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.post("/license-scan")
def license_scan(req: ScanRequest):
    try:
        # Run Syft for SBOM
        syft_result = subprocess.run(
            ["syft", req.image, "-o", "cyclonedx-json"],
            capture_output=True, text=True, check=True
        )
        sbom = json.loads(syft_result.stdout)
        licenses = set()
        for comp in sbom.get("components", []):
            for lic in comp.get("licenses", []):
                expr = lic.get("expression")
                if expr:
                    licenses.add(expr)
        return {"licenses": sorted(list(licenses))}
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Syft error: {e.stderr}")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid Syft JSON output.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.post("/sbom/upload")
def sbom_from_tar(file: UploadFile = File(...)):
    """
    Accepts a Docker image tarball (.tar), runs Syft, and returns CycloneDX JSON SBOM.
    """
    if not file.filename.endswith(".tar"):
        raise HTTPException(status_code=400, detail="Only .tar files are supported.")
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            tar_path = os.path.join(tmpdir, file.filename)
            with open(tar_path, "wb") as f:
                f.write(file.file.read())
            # Run Syft on the tarball
            syft_result = subprocess.run(
                ["syft", tar_path, "-o", "cyclonedx-json"],
                capture_output=True, text=True, check=True, encoding="utf-8", errors="replace"
            )
            sbom = json.loads(syft_result.stdout)
            return sbom
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Syft error: {e.stderr}\n{e.stdout}")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid Syft JSON output.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing tarball: {str(e)}")

@app.post("/sbom")
def generate_sbom(req: ScanRequest):
    """
    Generate a CycloneDX JSON SBOM for a given Docker image using Syft.
    """
    try:
        syft_result = subprocess.run(
            ["syft", req.image, "-o", "cyclonedx-json"],
            capture_output=True, text=True, check=True, encoding="utf-8", errors="replace"
        )
        sbom = json.loads(syft_result.stdout)
        return sbom
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Syft error: {e.stderr}\n{e.stdout}")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid Syft JSON output.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Syft unexpected error: {str(e)}")

@app.post("/risk-score")
def risk_score(req: ScanRequest):
    """
    Calculate risk score, CVE counts, and secrets detection for a Docker image.
    """
    try:
        # Run Syft for SBOM
        syft_result = subprocess.run(
            ["syft", req.image, "-o", "cyclonedx-json"],
            capture_output=True, text=True, check=True, encoding="utf-8", errors="replace"
        )
        sbom = json.loads(syft_result.stdout)
        # Run Grype for CVEs
        grype_result = subprocess.run(
            ["grype", req.image, "-o", "json"],
            capture_output=True, text=True, check=True, encoding="utf-8", errors="replace"
        )
        grype_output = json.loads(grype_result.stdout)
        matches = grype_output.get("matches", [])
        cve_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
        for m in matches:
            sev = m["vulnerability"]["severity"]
            if sev in cve_counts:
                cve_counts[sev] += 1
        license_violations = 0
        for comp in sbom.get("components", []):
            license_info = comp.get("licenses", [])
            for lic in license_info:
                expression = lic.get("expression", "")
                if "proprietary" in expression.lower() or "unknown" in expression.lower():
                    license_violations += 1
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
            (license_violations * 2) +
            (10 if secrets_found else 0)
        )
        score = min(10, score)
        return {
            "risk_score": round(score, 1),
            "cve_counts": cve_counts,
            "license_violations": license_violations,
            "secrets_found": secrets_found
        }
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Scan error: {e.stderr}")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid scan JSON output.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
