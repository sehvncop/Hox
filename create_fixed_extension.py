#!/usr/bin/env python3
import zipfile
import os
import shutil

def create_fixed_extension():
    """Create properly structured extension zip"""
    zip_path = "/app/gym-whatsapp-extension-fixed.zip"
    
    # Create temp directory for properly structured extension
    temp_dir = "/tmp/gym_extension"
    os.makedirs(temp_dir, exist_ok=True)
    
    # Copy and rename files with correct structure
    file_mapping = {
        "/app/dist/content.bundle.js": f"{temp_dir}/content.bundle.js",
        "/app/src/service-worker.js": f"{temp_dir}/service-worker.js", 
        "/app/src/landing.html": f"{temp_dir}/landing.html",
        "/app/manifest-fixed.json": f"{temp_dir}/manifest.json"
    }
    
    # Copy individual files
    for src, dst in file_mapping.items():
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"Copied: {src} -> {dst}")
    
    # Copy directories
    dir_mapping = {
        "/app/images": f"{temp_dir}/images",
        "/app/audio": f"{temp_dir}/audio"
    }
    
    for src_dir, dst_dir in dir_mapping.items():
        if os.path.exists(src_dir):
            shutil.copytree(src_dir, dst_dir, dirs_exist_ok=True)
            print(f"Copied directory: {src_dir} -> {dst_dir}")
    
    # Create the zip file
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(temp_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arc_path = os.path.relpath(file_path, temp_dir)
                zipf.write(file_path, arc_path)
                print(f"Added to zip: {arc_path}")
    
    # Cleanup temp directory
    shutil.rmtree(temp_dir)
    
    print(f"Fixed extension created: {zip_path}")
    print(f"File size: {os.path.getsize(zip_path)} bytes")
    
    # Copy to backend directory too
    shutil.copy2(zip_path, "/app/backend/gym-whatsapp-extension.zip")
    print("Copied to backend directory")

if __name__ == "__main__":
    create_fixed_extension()