#!/usr/bin/env python3
import os
from pathlib import Path

try:
    from fastapi import FastAPI, HTTPException
    from fastapi.responses import FileResponse
    import uvicorn
except ImportError:
    print("Installing required packages...")
    os.system("pip install fastapi uvicorn")
    from fastapi import FastAPI, HTTPException
    from fastapi.responses import FileResponse
    import uvicorn

app = FastAPI(title="Gym Extension API", version="1.0.0")

@app.get("/")
async def root():
    return {"message": "Gym WhatsApp Extension Backend", "status": "running", "version": "1.0.0"}

@app.get("/api/health")
async def health():
    return {"status": "healthy", "version": "1.0.0"}

@app.get("/api/download-extension")
async def download_extension():
    """Direct download of gym extension zip file"""
    extension_path = "/app/gym-whatsapp-extension-fixed.zip"
    
    if os.path.exists(extension_path):
        return FileResponse(
            path=extension_path,
            filename="gym-whatsapp-extension.zip",
            media_type="application/zip",
            headers={"Content-Disposition": "attachment; filename=gym-whatsapp-extension.zip"}
        )
    else:
        raise HTTPException(status_code=404, detail="Extension file not found")

@app.get("/api/extension-info")
async def extension_info():
    return {
        "name": "Gym WhatsApp Extension",
        "version": "1.0.0",
        "demo_key": "DEMO-KEY-2025",
        "features": [
            "CSV Upload Support",
            "Authentication System", 
            "30-minute Sessions",
            "WhatsApp Integration",
            "Message Customization"
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=False)