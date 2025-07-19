#!/usr/bin/env python3
import zipfile
import os
from pathlib import Path

def create_extension_zip():
    """Create the gym extension zip file"""
    zip_path = "/app/gym-whatsapp-extension.zip"
    
    # Files to include in the extension
    files_to_include = [
        "src/content.js",
        "src/service-worker.js", 
        "src/landing.html",
        "dist/content.bundle.js",
        "dist/content.bundle.js.LICENSE.txt",
        "manifest.json",
        "images/",
        "audio/",
        "_locales/"
    ]
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Add individual files
        for file_path in ["src/content.js", "src/service-worker.js", "src/landing.html", "dist/content.bundle.js", "dist/content.bundle.js.LICENSE.txt", "manifest.json"]:
            if os.path.exists(f"/app/{file_path}"):
                zipf.write(f"/app/{file_path}", file_path)
                print(f"Added: {file_path}")
        
        # Add directories
        for dir_path in ["images", "audio", "_locales"]:
            if os.path.exists(f"/app/{dir_path}"):
                for root, dirs, files in os.walk(f"/app/{dir_path}"):
                    for file in files:
                        file_path = os.path.join(root, file)
                        arc_path = os.path.relpath(file_path, "/app")
                        zipf.write(file_path, arc_path)
                        print(f"Added: {arc_path}")
    
    print(f"Extension zip created: {zip_path}")
    print(f"File size: {os.path.getsize(zip_path)} bytes")

if __name__ == "__main__":
    create_extension_zip()