from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import uvicorn

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Gym WhatsApp Extension Backend", "status": "running"}

@app.get("/api/health")
async def health():
    return {"status": "healthy", "version": "11.0.0"}

@app.get("/api/download-extension")
async def download_extension():
    """Serve the gym extension zip file for download"""
    extension_path = "/app/gym-whatsapp-extension.zip"
    
    if os.path.exists(extension_path):
        return FileResponse(
            path=extension_path,
            filename="gym-whatsapp-extension.zip",
            media_type="application/zip"
        )
    else:
        raise HTTPException(status_code=404, detail="Extension file not found")

@app.get("/api/extension-info")
async def extension_info():
    return {
        "name": "Gym WhatsApp Extension",
        "version": "11.0.0",
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
    uvicorn.run(app, host="0.0.0.0", port=8001)