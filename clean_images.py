import os
from rembg import remove
from PIL import Image

# CONFIGURATION
# 1. Where your raw images are (e.g., 'public/images/raw_products')
INPUT_DIR = 'public/images/raw_products' 
# 2. Where you want the clean transparent images (e.g., 'public/images/products')
OUTPUT_DIR = 'public/images/products'

# Create output folder if it doesn't exist
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def process_images():
    files = os.listdir(INPUT_DIR)
    total = len(files)
    
    print(f"Found {total} images. Starting background removal...")

    for index, filename in enumerate(files):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            try:
                # Construct paths
                input_path = os.path.join(INPUT_DIR, filename)
                
                # Save as PNG to support transparency
                output_filename = os.path.splitext(filename)[0] + ".png"
                output_path = os.path.join(OUTPUT_DIR, output_filename)

                # Open and process
                print(f"[{index+1}/{total}] Processing: {filename}...")
                with open(input_path, 'rb') as i:
                    with open(output_path, 'wb') as o:
                        input_image = i.read()
                        # This line does the AI Magic
                        output_image = remove(input_image)
                        o.write(output_image)
                        
            except Exception as e:
                print(f"Error processing {filename}: {e}")

    print("Done! All backgrounds removed.")

if __name__ == "__main__":
    process_images()