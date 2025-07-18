from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
import zipfile
import shutil
from pathlib import Path

app = FastAPI(title="Gym WhatsApp Extension Landing Page")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def landing_page():
    """Serve the landing page"""
    try:
        with open("/app/src/landing.html", "r") as f:
            content = f.read()
        return HTMLResponse(content=content)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Landing page not found")

@app.get("/api/download-extension")
async def download_extension():
    """Create and serve the extension zip file"""
    try:
        # Create a zip file of the build directory
        zip_path = "/app/gym-whatsapp-extension.zip"
        
        # Remove existing zip if it exists
        if os.path.exists(zip_path):
            os.remove(zip_path)
        
        # Create zip file
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            build_dir = Path("/app/build")
            for file_path in build_dir.rglob("*"):
                if file_path.is_file():
                    # Add file to zip with relative path
                    arcname = file_path.relative_to(build_dir.parent)
                    zipf.write(file_path, arcname)
        
        return FileResponse(
            zip_path,
            media_type="application/zip",
            filename="gym-whatsapp-extension.zip",
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "*",
                "Cache-Control": "no-cache",
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating extension package: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "extension": "Gym WhatsApp Extension Landing Page"}

@app.get("/api/extension-info")
async def extension_info():
    """Get extension information"""
    return {
        "name": "Gym WhatsApp Extension",
        "version": "11.0.0",
        "description": "Send bulk messages to your gym members via CSV upload",
        "demo_key": "DEMO-KEY-2025",
        "features": [
            "CSV file upload for member lists",
            "Secure key-based authentication",
            "30-minute key validation intervals", 
            "Custom message templates with variables",
            "AI-powered message rewriting",
            "Random delay between messages",
            "Modern gym-themed UI"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)