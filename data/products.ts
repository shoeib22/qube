export interface Product {
  id: string;
  name: string;
  category: string;
  price?: number;
  image?: string;
}

// Quick helper to create IDs
const id = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// 1. Define the raw data list
const rawProducts: Product[] = [
  // -----------------------------
  // Plugs & IR
  // -----------------------------
  // Retrofits
  // -----------------------------
  // -----------------------------
  // Strip Controllers
  // -----------------------------
  
  // -----------------------------
  // Motorised Products
  // -----------------------------
  { id: id("Pulse Switch Curtain Controller"), name: "Pulse Switch/Curtain Controller", category: "Motorised Products" },
  // -----------------------------
  // Premium Touch
  // -----------------------------
  { id: id("Chrome Glass Touch"), name: "Chrome Glass Touch", category: "Premium Touch" },
  { id: id("Metal Touch"), name: "Metal Touch", category: "Premium Touch" },
  { id: id("4 Touch-RF"), name: "4 Touch-RF (6A-Relay)", category: "Premium Touch" },
  { id: id("HD Touch-RF"), name: "HD Touch-RF (16A-Relay)", category: "Premium Touch" },
  { id: id("Fan Dimmer Touch-RF"), name: "Fan Dimmer Touch-RF (6A-Relay)", category: "Premium Touch" },
  { id: id("2 Touch-Acrylic"), name: "2 Touch-Acryllic", category: "Premium Touch" },
  { id: id("4 Touch-Acrylic"), name: "4 Touch-Acryllic", category: "Premium Touch" },
  { id: id("HD Touch-Acrylic"), name: "HD Touch-Acryllic", category: "Premium Touch" },
  { id: id("FAN Touch-Acrylic"), name: "FAN Touch-Acryllic", category: "Premium Touch" },

  // -----------------------------
  // Modular Touch
  // -----------------------------
  { id: id("2 Touch-Pro"), name: "2 Touch-Pro (10A-Relay & RGB Led)", category: "Modular Touch" },
  { id: id("4 Touch-Pro"), name: "4 Touch-Pro (10A-Relay & RGB Led)", category: "Modular Touch" },
  { id: id("HD Touch-Pro"), name: "HD Touch-Pro (16A-Relay & RGB Led)", category: "Modular Touch" },
  { id: id("Fan Dimmer Touch-Pro"), name: "Fan Dimmer Touch-Pro (10A-Relay & RGB Led)", category: "Modular Touch" },
  { id: id("4 Touch-Basic"), name: "4 Touch-Basic (6A-Relay)", category: "Modular Touch" },
  { id: id("HD Touch-Basic"), name: "HD Touch-Basic (16A-Relay)", category: "Modular Touch" },
  { id: id("Fan Dimmer Touch-Basic"), name: "Fan Dimmer Touch-Basic (6A-Relay)", category: "Modular Touch" },

  // -----------------------------
  // Full Glass Touch (New Category)
  // -----------------------------
  { id: id("Full Glass Touch 2 Switch 2M"), name: "Full Glass Touch 2 Switch (1-25A) (2M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 4 Switch 2M"), name: "Full Glass Touch 4 Switch (2M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch Fan 2M"), name: "Full Glass Touch Fan (2M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 2 Switch 1 Curtain 2M"), name: "Full Glass Touch 2 Switch 1 Curtain (2M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 1 Curtain 2M"), name: "Full Glass Touch 1 Curtain (2M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 4 Switch 1 Fan 4M"), name: "Full Glass Touch 4 Switch 1 Fan (4M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 2 Switch 1 Fan 4M"), name: "Full Glass Touch 2 Switch (1-25A) 1 Fan (4M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 6 Switch 4M"), name: "Full Glass Touch 6 Switch (1-20A) (4M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 8 Switch 4M"), name: "Full Glass Touch 8 Switch (1-20A) (4M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 2 Switch 1 Socket 4M"), name: "Full Glass Touch 2 Switch (1-25A) 1 Socket (1-10A) (4M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 2 Switch 1 Fan 1 Curtain 4M"), name: "Full Glass Touch 2 Switch 1 Fan 1 Curtain (4M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 4 Switch 1 Curtain 4M"), name: "Full Glass Touch 4 Switch (1-25A) 1 Curtain (4M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 6 Switch 1 Curtain 4M"), name: "Full Glass Touch 6 Switch (1-25A) 1 Curtain (4M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 6 Switch 1 Fan 6M"), name: "Full Glass Touch 6 Switch (1-25A) 1 Fan (6M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 10 Switch 6M"), name: "Full Glass Touch 10 Switch (2-20A) (6M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 4 Switch 2 Fan 6M"), name: "Full Glass Touch 4 Switch 2 Fan (6M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 4 Switch 1 Fan 1 Socket 6M"), name: "Full Glass Touch 4 Switch 1 Fan 1 Socket (1-10A) (6M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 2 Switch 1 Fan 1 Socket 6M"), name: "Full Glass Touch 2 Switch (1-25A) 1 Fan 1 Socket (1-10A) (6M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 6 Switch 1 Socket 6M"), name: "Full Glass Touch 6 Switch (1-25A) 1 Socket (1-10A) (6M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 8 Switch 1 Socket 6M"), name: "Full Glass Touch 8 Switch (1-20A) 1 Socket (1-10A) (6M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 2 Switch 2 Socket 6M"), name: "Full Glass Touch 2 Switch (1-25A) 2 Socket (2-10A) (6M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 4 Switch 2 Socket 6M"), name: "Full Glass Touch 4 Switch 2 Socket (2-10A) (6M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 8 Switch 1 Curtain 6M"), name: "Full Glass Touch 8 Switch (2-25A) 1 Curtain (6M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 4 Switch 1 Fan 1 Curtain 6M"), name: "Full Glass Touch 4 Switch (1-25A) 1 Fan 1 Curtain (6M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 6 Switch 1 Socket 1 Curtain 6M"), name: "Full Glass Touch 6 Switch (1-25A) 1 Socket (1-10A) 1 Curtain (6M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 4 Switch 2 Fan 1 Socket 8M"), name: "Full Glass Touch 4 Switch 2 Fan 1 Socket (1-10A) (8M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 6 Switch 1 Fan 1 Socket 8M"), name: "Full Glass Touch 6 Switch (1-25A) 1 Fan 1 Socket (1-10A) (8M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 10 Switch 1 Socket 8M"), name: "Full Glass Touch 10 Switch (2-20A) 1 Socket (1-10A) (8M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 4 Switch 2 Fan 8M"), name: "Full Glass Touch 4 Switch 2 Fan (8M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 6 Switch 1 Fan 8M"), name: "Full Glass Touch 6 Switch (1-25A) 1 Fan (8M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 10 Switch 8M"), name: "Full Glass Touch 10 Switch (2-20A) (8M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 4 Switch 1 Fan 1 Curtain 8M"), name: "Full Glass Touch 4 Switch (1-25A) 1 Fan 1 Curtain (8M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 8 Switch 1 Curtain 8M"), name: "Full Glass Touch 8 Switch (2-20A) 1 Curtain (8M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 8 Switch 1 Curtain 1 Socket 8M"), name: "Full Glass Touch 8 Switch (2-20A) 1 Curtain 1 Socket (1-10A) (8M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 4 Switch 1 Fan 1 Curtain 1 Socket 8M"), name: "Full Glass Touch 4 Switch (1-25A) 1 Fan 1 Curtain 1 Socket (1-10A) (8M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 20 Switch 12M"), name: "Full Glass Touch 20 Switch (4-20A) (12M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 8 Switch 4 Fan 12M"), name: "Full Glass Touch 8 Switch 4 Fan (12M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 6 Switch 2 Fan 2 Socket 12M"), name: "Full Glass Touch 6 Switch (1-25A) 2 Fan 2 Socket (2-10A) (12M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 8 Switch 1 Fan 2 Socket 12M"), name: "Full Glass Touch 8 Switch (2-25A) 1 Fan 2 Socket (2-10A) (12M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 8 Switch 2 Fan 2 Socket 12M"), name: "Full Glass Touch 8 Switch 2 Fan 2 Socket (2-10A) (12M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 10 Switch 1 Fan 2 Socket 12M"), name: "Full Glass Touch 10 Switch (1-25A) 1 Fan 2 Socket (2-10A) (12M)", category: "Full Glass Touch" },
  { id: id("Full Glass Touch 10 Switch 2 Socket 1 Curtain 12M"), name: "Full Glass Touch 10 Switch (3-25A) 2 Socket (2-10A) 1 Curtain (12M)", category: "Full Glass Touch" },
  { id: id("Socket 16A"), name: "Socket 16A (2M)", category: "Full Glass Touch" },

  // -----------------------------
  // Magnetic Touch (New Category)
  // -----------------------------
  { id: id("Magnetic 4+1Fan Touch"), name: "Magnetic 4+1Fan Touch (4410)", category: "Magnetic Touch" },
  { id: id("Magnetic 7+HD+Socket Touch"), name: "Magnetic 7+HD+Socket Touch (6701S)", category: "Magnetic Touch" },
  { id: id("Magnetic 3+1Fan+HD+1Socket Touch"), name: "Magnetic 3+1Fan+HD+1Socket Touch (6311S)", category: "Magnetic Touch" },
  { id: id("Magnetic 7+Fan+HD Touch"), name: "Magnetic 7+Fan+HD Touch (6711)", category: "Magnetic Touch" },
  { id: id("Magnetic 5+1Fan+HD+Socket Touch"), name: "Magnetic 5+1Fan+HD+Socket Touch (8511S)", category: "Magnetic Touch" },
  { id: id("Magnetic 5+2Fan+HD Touch"), name: "Magnetic 5+2Fan+HD Touch (8521)", category: "Magnetic Touch" },
  { id: id("Magnetic 9+HD+Socket Touch"), name: "Magnetic 9+HD+Socket Touch (8901S)", category: "Magnetic Touch" },

  // -----------------------------
  // Smart Locks
  // -----------------------------
  { id: id("Smart Lock Ultra"), name: "Smart Lock Ultra", category: "Smart Locks" },
  { id: id("Smart Lock Pro Black"), name: "Smart Lock Pro-Black (WiFi)", category: "Smart Locks" },
  { id: id("Smart Lock Pro Silver"), name: "Smart Lock Pro-Silver", category: "Smart Locks" },
  { id: id("Cabinet Lock"), name: "Cabinet Lock", category: "Smart Locks" },

  // -----------------------------
  // Smart Lighting (COB, Panel, Drivers)
  // -----------------------------
  { id: id("LED Dimmer Driver 18W"), name: "LED Dimmer Driver 18W (Panel Lights)", category: "Smart Lighting" },
  { id: id("Smart WiFi Bi-Channel CCT COB with 2 LED 18W"), name: "Smart WiFi Bi-Channel CCT COB with 2 LED-18W", category: "Smart Lighting" },
  { id: id("36W 2X2 Panel Light"), name: "36W 2X2 Panel Light", category: "Smart Lighting" },
  { id: id("Dimmable CCT 36W 2X2 Panel RF"), name: "Dimmable CCT 36W 2X2 Panel RF", category: "Smart Lighting" },
  
  // Brochure Lighting Items
  { id: id("Vintage Slim Panel Light"), name: "VINTAGE SLIM PANEL LIGHT", category: "Smart Lighting" },
  { id: id("Novel SSK Panel"), name: "NOVEL SSK PANEL", category: "Smart Lighting" },
  { id: id("Prime SSK Panel"), name: "PRIME SSK PANEL", category: "Smart Lighting" },
  { id: id("Reeem Panel Light"), name: "REEEM PANEL LIGHT", category: "Smart Lighting" },
  { id: id("Moon Adjustable Panel"), name: "MOON ADJUSTABLE PANEL", category: "Smart Lighting" },
  { id: id("Keta Deep Down"), name: "KETA DEEP DOWN", category: "Smart Lighting" },
  { id: id("Sonat Deep Down"), name: "SONAT DEEP DOWN", category: "Smart Lighting" },
  { id: id("Selto Deep Down"), name: "SELTO DEEP DOWN", category: "Smart Lighting" },
  { id: id("Vintage Surface Panel"), name: "VINTAGE SURFACE PANEL", category: "Smart Lighting" },
  { id: id("Vision Surface Panel"), name: "VISION Surface Panel", category: "Smart Lighting" },
  { id: id("LX Panel"), name: "LX PANEL", category: "Smart Lighting" },
  { id: id("Orion Deep COB"), name: "ORION DEEP COB", category: "Smart Lighting" },
  { id: id("Glaze CR COB Light"), name: "GLAZE CR COB LIGHT", category: "Smart Lighting" },
  { id: id("Glaze SR COB Light"), name: "GLAZE SR COB LIGHT", category: "Smart Lighting" },
  { id: id("Crook COB Light"), name: "CROOK COB LIGHT", category: "Smart Lighting" },
  { id: id("Buzz COB Light"), name: "BUZZ COB LIGHT", category: "Smart Lighting" },
  { id: id("Gleez Movable COB"), name: "GLEEZ MOVABLE COB", category: "Smart Lighting" },
  { id: id("Pearl COB Light"), name: "PEARL COB LIGHT", category: "Smart Lighting" },
  { id: id("Pearl Button Light"), name: "PEARL BUTTON LIGHT", category: "Smart Lighting" },
  { id: id("Pebble Button Light"), name: "PEBBLE BUTTON LIGHT", category: "Smart Lighting" },
  { id: id("Gloss Spot Light"), name: "GLOSS SPOT LIGHT", category: "Smart Lighting" },
  { id: id("Dvio Cylinder"), name: "DVIO CYLINDER", category: "Smart Lighting" },
  { id: id("Ovio Cylinder"), name: "OVIO CYLINDER", category: "Smart Lighting" },
  { id: id("Orio Cylinder"), name: "ORIO CYLINDER", category: "Smart Lighting" },
  { id: id("Glaze SF Cylinder"), name: "Glaze SF CYLINDER", category: "Smart Lighting" },
  { id: id("Crook SF Cylinder"), name: "CROOK SF CYLINDER", category: "Smart Lighting" },
  { id: id("Buzz SF Cylinder"), name: "BUZZ SF CYLINDER", category: "Smart Lighting" },
  { id: id("Glaze Twist Movable Cylinder"), name: "GLAZE TWIST MOVABLE CYLINDER", category: "Smart Lighting" },
  { id: id("Focus Track Light"), name: "FOCUS TRACK LIGHT", category: "Smart Lighting" },
  { id: id("Platinum Street Light"), name: "PLATINUM STREET LIGHT", category: "Smart Lighting" },
  { id: id("Crystal Street Light"), name: "CRYSTAL STREET LIGHT", category: "Smart Lighting" },
  { id: id("Radius Street Light"), name: "RADIUS STREET LIGHT", category: "Smart Lighting" },
  { id: id("Elite Flood Light"), name: "ELITE FLOOD LIGHT", category: "Smart Lighting" },
  { id: id("Gem Flood Light"), name: "GEM FLOOD LIGHT", category: "Smart Lighting" },
  { id: id("Diamond Flood Light"), name: "DIAMOND FLOOD LIGHT", category: "Smart Lighting" },
  { id: id("Gear 30% back chock"), name: "GEAR 30% BACK CHOCK FLOOD LIGHT", category: "Smart Lighting" },
  { id: id("Glass High Bay Light"), name: "Glass HIGH BAY LIGHT", category: "Smart Lighting" },
  { id: id("UFO Highbay Light"), name: "UFO HIGHBAY LIGHT", category: "Smart Lighting" },
  { id: id("Lens Series"), name: "LENS SERIES", category: "Smart Lighting" },
  { id: id("Aqua CL 979"), name: "AQUA CL 979", category: "Smart Lighting" },
  { id: id("Optima CL978"), name: "OPTIMA CL978", category: "Smart Lighting" },
  { id: id("Flavia CL 973"), name: "FLAVIA CL 973", category: "Smart Lighting" },
  { id: id("Trimless 974"), name: "TRIMLESS 974", category: "Smart Lighting" },
  { id: id("Strike CL981"), name: "Strike-CL981", category: "Smart Lighting" },
  { id: id("Linea Pro CL 982"), name: "LINEA PRO - CL 982", category: "Smart Lighting" },
  { id: id("Trimless Rio CL 980"), name: "TRIMLESS RIO CL 980", category: "Smart Lighting" },
  { id: id("Butterfly CL 975"), name: "BUTTERFLY CL 975", category: "Smart Lighting" },
  { id: id("Cdore CL 975"), name: "CDORE CL 975", category: "Smart Lighting" },
  { id: id("Experia CL 9"), name: "Experia CL 9", category: "Smart Lighting" },
  { id: id("Brezza CL 975"), name: "BREZZA CL 975", category: "Smart Lighting" },
  { id: id("Rosella CL 975"), name: "ROSELLA CL 975", category: "Smart Lighting" },
  { id: id("Glanza CL 956"), name: "Glanza -CL 956", category: "Smart Lighting" },
  { id: id("Adore CL 957"), name: "Adore - CL 957", category: "Smart Lighting" },
  { id: id("Sleek CL 958"), name: "Sleek-CL 958", category: "Smart Lighting" },
  { id: id("Polo CL 959"), name: "Polo - CL 959", category: "Smart Lighting" },
  { id: id("Wonder CL 975"), name: "WONDER CL 975", category: "Smart Lighting" },
  { id: id("Pipe CL 975"), name: "PIPE CL 975", category: "Smart Lighting" },
  { id: id("Rio CL 962"), name: "RIO CL 962", category: "Smart Lighting" },
  { id: id("Comet CL 963"), name: "COMET CL 963", category: "Smart Lighting" },
  { id: id("Swift CL 964"), name: "SWIFT CL 964", category: "Smart Lighting" },
  { id: id("Glacier CL 965"), name: "GLACIER CL 965", category: "Smart Lighting" },
  { id: id("Matrix CL 966"), name: "MATRIX CL 966", category: "Smart Lighting" },
  { id: id("Parkar CL 967"), name: "PARKAR CL 967", category: "Smart Lighting" },
  { id: id("Belton CL 926"), name: "BELTON CL 926", category: "Smart Lighting" },
  { id: id("Streak CL 927"), name: "STREAK CL 927", category: "Smart Lighting" },
  { id: id("Zudio CL 968"), name: "ZUDIO CL 968", category: "Smart Lighting" },
  { id: id("Nexon CL 905"), name: "NEXON CL 905", category: "Smart Lighting" },
  { id: id("Battler CL 944"), name: "BATTLER CL 944", category: "Smart Lighting" },
  { id: id("Coral CL 932"), name: "CORAL CL 932", category: "Smart Lighting" },
  { id: id("Jawa CL 935"), name: "JAWA CL 935", category: "Smart Lighting" },
  { id: id("Zoom CL 916"), name: "ZOOM CL 916", category: "Smart Lighting" },
  { id: id("Nebula CL 924"), name: "NEBULA CL 924", category: "Smart Lighting" },
  { id: id("Harmony CL 906"), name: "HARMONY CL 906", category: "Smart Lighting" },
  { id: id("Seltos CL 907"), name: "SELTOS CL 907", category: "Smart Lighting" },
  { id: id("Delta CL 901"), name: "DELTA CL 901", category: "Smart Lighting" },
  { id: id("Curvy CL 902"), name: "CURVY CL 902", category: "Smart Lighting" },
  { id: id("Beat CL 908"), name: "BEAT CL 908", category: "Smart Lighting" },

  // -----------------------------
  // Energy Meters & Power Modules
  // -----------------------------
  // Smart Fans
  // -----------------------------

  // -----------------------------
  // Sensors
  // -----------------------------
  { id: id("Microwave Motion Sensor"), name: "Microwave Motion Sensor", category: "Sensors" },
  { id: id("Sensor Hub"), name: "Sensor Hub (Smart IR with Temperature sensor)", category: "Sensors" },
  // -----------------------------
  // Cameras
  // -----------------------------
  { id: id("IP Camera Dome"), name: "IP Camera Dome (5MP)", category: "Cameras" },
  { id: id("IP Camera Bullet"), name: "IP Camera Bullet (5MP)", category: "Cameras" },

  // -----------------------------
  // LED Strips & SMPS
  // -----------------------------

  // -----------------------------
  // Smart QR Products
  // -----------------------------
  { id: id("Smart Welcome Kit"), name: "SMART WELCOME KIT (QR VDP, Car SOS, NFC Card)", category: "Smart QR Products" },
  { id: id("NFC Business Card"), name: "NFC Business Card", category: "Smart QR Products" },
  { id: id("NFC Tag Sticker"), name: "NFC Tag/Sticker", category: "Smart QR Products" },
  { id: id("QR Tags"), name: "QR Tags", category: "Smart QR Products" },

  // -----------------------------
  // Other / Misc
  // -----------------------------
  { id: id("Home Sync"), name: "Home Sync (Apple Home Kit)", category: "Other" },
  { id: id("Stream Hub"), name: "Stream Hub (Cameras Integration)", category: "Other" },
  { id: id("SPD 10KV"), name: "SPD 10KV", category: "Power Modules" },
];

export const products: Product[] = rawProducts.map((p) => {
  const cleanName = p.name
    .split("(")[0]
    .replace(/-/g, " ")           // 1. RESTORE THIS: Convert dashes to spaces
    .replace("Acryllic", "Acrylic") // 2. ADD THIS: Fix the typo in the data
    .replace(/\//g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    ...p,
    image: p.image || `/images/products/${cleanName}.png`,
  };
});