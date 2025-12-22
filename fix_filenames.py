import os
import re

# Path to your products folder
DIR = 'public/images/products'

def fix_filenames():
    if not os.path.exists(DIR):
        print(f"Error: Directory {DIR} not found.")
        return

    count = 0
    for filename in os.listdir(DIR):
        if not filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            continue

        # 1. Start with original name
        new_name = filename

        # 2. Replace dashes with spaces (Matches products.ts .replace(/-/g, " "))
        new_name = new_name.replace("-", " ")

        # 3. Remove "2M", "4M", "12M" etc. from the end (Matches products.ts .split("(")[0])
        # This regex looks for a space, followed by digits, then 'M', then the extension
        new_name = re.sub(r'\s\d+M(\.png|\.jpg)', r'\1', new_name)

        # 4. Collapse multiple spaces
        new_name = re.sub(r'\s+', ' ', new_name)

        # 5. Rename if changed
        if new_name != filename:
            try:
                src = os.path.join(DIR, filename)
                dst = os.path.join(DIR, new_name)
                
                # Check if target already exists to prevent overwriting
                if os.path.exists(dst):
                    print(f"Skipping {filename} -> {new_name} (Target exists)")
                else:
                    os.rename(src, dst)
                    print(f"Fixed: {filename} -> {new_name}")
                    count += 1
            except Exception as e:
                print(f"Error renaming {filename}: {e}")

    print(f"Done! Renamed {count} files.")

if __name__ == "__main__":
    fix_filenames()