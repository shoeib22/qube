import re
import os

PRODUCTS_FILE = r'c:\cubefinalinnextjs\cube-tech\data\products.ts'
IMAGES_DIR = r'c:\cubefinalinnextjs\cube-tech\public\temp_images\product page image'

def get_clean_name(name):
    # Mimic products.ts logic
    s = name.split("(")[0]
    s = s.replace("-", " ")
    s = s.replace("Acryllic", "Acrylic")
    s = s.replace("/", " ")
    s = " ".join(s.split())
    return s.strip()

def parse_products():
    products = []
    if not os.path.exists(PRODUCTS_FILE):
        print(f"Product file not found: {PRODUCTS_FILE}")
        return []

    with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
        for line in f:
            m = re.search(r'name:\s*"(.*?)",\s*category:\s*"(.*?)"', line)
            if m:
                raw_name = m.group(1)
                category = m.group(2)
                products.append({
                    'raw_name': raw_name,
                    'category': category,
                    'clean_name': get_clean_name(raw_name)
                })
    return products

def main():
    products = parse_products()
    print(f"Total Products: {len(products)}")
    
    if not os.path.exists(IMAGES_DIR):
        print(f"Images directory not found: {IMAGES_DIR}")
        print("Please ensure you have unzipped the images to the temp directory.")
        return

    # Group products by category
    by_category = {}
    for p in products:
        c = p['category']
        if c not in by_category:
            by_category[c] = []
        by_category[c].append(p)

    try:
        folders = sorted(os.listdir(IMAGES_DIR))
    except Exception as e:
        print(f"Error accessing images directory: {e}")
        return
    
    output_file = "analysis_results.txt"
    print(f"Writing analysis to {output_file}...")
    
    with open(output_file, "w", encoding="utf-8") as out:
        out.write(f"Total Products: {len(products)}\n")
        out.write("\n--- Folder Analysis ---\n")
        for f in folders:
            f_path = os.path.join(IMAGES_DIR, f)
            if not os.path.isdir(f_path):
                continue
            files = [x for x in os.listdir(f_path) if x.endswith('.png')]
            count = len(files)
            
            # Heuristic Matching
            match_type = "NONE"
            candidates = []
            
            f_norm = f.lower().replace(" ", "")
            
            # 1. Try Exact Product Name Match & Prefix Match together
            matching_products = []
            for p in products:
                p_norm = p['clean_name'].lower().replace(" ", "")
                # Exact match of folder name to product name
                if p_norm == f_norm:
                    matching_products = [p]
                    match_type = "EXACT_PRODUCT"
                    break
                # Prefix match: Product starts with Folder name
                if p_norm.startswith(f_norm):
                    matching_products.append(p)
            
            if match_type == "NONE" and matching_products:
                 match_type = "PRODUCT_PREFIX"
                 candidates = matching_products
    
            # 2. Try Category Match
            if match_type == "NONE":
                for cat, items in by_category.items():
                    cat_norm = cat.lower().replace(" ", "").replace("&", "")
                    if f_norm == cat_norm or f_norm in cat_norm:
                        if len(items) > 0:
                           match_type = f"CATEGORY ({cat})"
                           candidates = items
                           break
    
            out.write(f"Folder: {f} ({count} files) -> {match_type}\n")
            if candidates:
                out.write(f"   Matches {len(candidates)} products. Ratio: {count/len(candidates):.2f}\n")
                if len(candidates) < 5:
                    for c in candidates:
                         out.write(f"       - {c['clean_name']}\n")
                else:
                    out.write(f"       - {candidates[0]['clean_name']} ... {candidates[-1]['clean_name']}\n")
    
    print("Done.")

if __name__ == "__main__":
    main()
