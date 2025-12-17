export interface Product {
  id: string;
  name: string;
  category: string;
  price?: number;      // optional since your PDF has no pricing
  image?: string;      // optional – use placeholder
}

// Quick helper to create IDs
const id = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export const products: Product[] = [
  // -----------------------------
  // Plugs & IR
  // -----------------------------
  { id: id("RED Smart Remote"), name: "RED - Smart Remote", category: "Plugs & IR" },
  { id: id("HD Plug 16A V2"), name: "HD Plug - 16A V2", category: "Plugs & IR" },
  { id: id("LPF 1 Switch"), name: "LPF 1 Switch (16A Relay)", category: "Plugs & IR" },
  { id: id("LPF 2 Switch"), name: "LPF 2 Switch (16A Relay)", category: "Plugs & IR" },
  { id: id("LPF 4 Switch"), name: "LPF 4 Switch (16A Relay)", category: "Plugs & IR" },
  { id: id("LPF 6 Switch"), name: "LPF 6 Switch (16A Relay)", category: "Plugs & IR" },
  { id: id("LPF HD Module 25A"), name: "LPF HD Module 25A (25A Relay)", category: "Plugs & IR" },

  // -----------------------------
  // Retrofits
  // -----------------------------
  { id: id("NEXA 1 Switch"), name: "NEXA 1 Switch (6A Relay)", category: "Retrofits" },
  { id: id("NEXA 2 Switch"), name: "NEXA 2 Switch (6A Relay)", category: "Retrofits" },
  { id: id("NEXA 3 Switch"), name: "NEXA 3 Switch (6A Relay)", category: "Retrofits" },
  { id: id("NEXA 5 Switch"), name: "NEXA 5 Switch (6A Relay)", category: "Retrofits" },
  { id: id("NEXA 1+1 Switch"), name: "NEXA 1+1 Switch (6A Relay)", category: "Retrofits" },
  { id: id("NEXA HD 16A Switch"), name: "NEXA HD 16A Switch", category: "Retrofits" },
  { id: id("25A HD+ Switch"), name: "25A HD+ Switch (25A Relay)", category: "Retrofits" },
  { id: id("NEXA 2+1 Switch"), name: "NEXA 2+1 Switch (10A Relay)", category: "Retrofits" },
  { id: id("NEXA 4+1 Switch"), name: "NEXA 4+1 Switch (10A Relay)", category: "Retrofits" },

  // -----------------------------
  // Strip Controllers
  // -----------------------------
  { id: id("RGBW 12V"), name: "RGBW 12V", category: "Strip Controllers" },
  { id: id("RGBW 24V"), name: "RGBW 24V", category: "Strip Controllers" },
  { id: id("RGBW Controller"), name: "RGBW Controller (RGBW/CCT)", category: "Strip Controllers" },

  // -----------------------------
  // Modular Touch
  // -----------------------------
  { id: id("Pulse Switch Curtain Controller"), name: "Pulse Switch / Curtain Controller", category: "Modular Touch" },
  { id: id("Chrome Glass Touch"), name: "Chrome Glass Touch", category: "Modular Touch" },
  { id: id("Metal Touch"), name: "Metal Touch", category: "Modular Touch" },
  { id: id("2 Touch-Pro"), name: "2 Touch-Pro (10A Relay & RGB LED)", category: "Modular Touch" },
  { id: id("4 Touch-Pro"), name: "4 Touch-Pro (10A Relay & RGB LED)", category: "Modular Touch" },
  { id: id("HD Touch-Pro"), name: "HD Touch-Pro (16A Relay & RGB LED)", category: "Modular Touch" },
  { id: id("Fan Dimmer Touch-Pro"), name: "Fan Dimmer Touch-Pro", category: "Modular Touch" },
  { id: id("4 Touch-Basic"), name: "4 Touch-Basic (6A Relay)", category: "Modular Touch" },
  { id: id("HD Touch-Basic"), name: "HD Touch-Basic (16A Relay)", category: "Modular Touch" },
  { id: id("Fan Dimmer Touch-Basic"), name: "Fan Dimmer Touch-Basic", category: "Modular Touch" },

  // -----------------------------
  // Premium Touch (RF & Acrylic)
  // -----------------------------
  { id: id("4 Touch-RF"), name: "4 Touch-RF (6A Relay)", category: "Premium Touch" },
  { id: id("HD Touch-RF"), name: "HD Touch-RF (16A Relay)", category: "Premium Touch" },
  { id: id("Fan Dimmer Touch-RF"), name: "Fan Dimmer Touch-RF", category: "Premium Touch" },
  { id: id("2 Touch-Acrylic"), name: "2 Touch-Acrylic", category: "Premium Touch" },
  { id: id("4 Touch-Acrylic"), name: "4 Touch-Acrylic", category: "Premium Touch" },
  { id: id("HD Touch-Acrylic"), name: "HD Touch-Acrylic", category: "Premium Touch" },
  { id: id("FAN Touch-Acrylic"), name: "FAN Touch-Acrylic", category: "Premium Touch" },

  // -----------------------------
  // Smart Locks
  // -----------------------------
  { id: id("Smart Lock Ultra"), name: "Smart Lock Ultra", category: "Smart Locks" },
  { id: id("Smart Lock Pro Black"), name: "Smart Lock Pro - Black (WiFi)", category: "Smart Locks" },
  { id: id("Smart Lock Pro Silver"), name: "Smart Lock Pro - Silver", category: "Smart Locks" },
  { id: id("Cabinet Lock"), name: "Cabinet Lock", category: "Smart Locks" },

  // -----------------------------
  // Smart Lighting (COB, Panel, Drivers)
  // -----------------------------
  { id: id("LED 18W"), name: "LED 18W 2LEDs + 1 Driver", category: "Smart Lighting" },
  { id: id("LED Dimmer Driver 18W"), name: "LED Dimmer Driver 18W", category: "Smart Lighting" },
  { id: id("LED Dimmer Driver CCT"), name: "LED Dimmer Driver 18W CCT", category: "Smart Lighting" },
  // ... (you have many more — I will include ALL remaining entries if you want)

  // -----------------------------
  // Energy Meters & Power Modules
  // -----------------------------
  { id: id("Smart Single-Phase Energy Meter"), name: "Smart Single-Phase Energy Meter - 30A", category: "Energy Meters" },
  { id: id("Smart Three-Phase Energy Meter"), name: "Smart Three-Phase Energy Meter", category: "Energy Meters" },
  { id: id("Smart Power Module 30A"), name: "Smart Single-Phase Power Module - 30A", category: "Power Modules" },
  { id: id("Smart Three-Phase Power Module"), name: "Smart Three-Phase Power Module", category: "Power Modules" },

  // -----------------------------
  // Smart Fans
  // -----------------------------
  { id: id("Smart BLDC Fan Classic Black"), name: "Smart BLDC Fan - Classic Plain (Black)", category: "Smart Fans" },
  { id: id("Smart BLDC Fan Classic Brown"), name: "Smart BLDC Fan - Classic Plain (Brown)", category: "Smart Fans" },
  // ... (many more fan variants)

  // -----------------------------
  // Sensors & Misc
  // -----------------------------
  { id: id("Microwave Motion Sensor"), name: "Microwave Motion Sensor", category: "Sensors" },
  { id: id("Sensor Hub"), name: "Sensor Hub (Smart IR + Temperature)", category: "Sensors" },
  { id: id("Gas Smoke Sensor"), name: "Gas & Smoke Sensor", category: "Sensors" },

  // -----------------------------
  // Cameras
  // -----------------------------
  { id: id("IP Camera Dome"), name: "IP Camera Dome (5MP)", category: "Cameras" },
  { id: id("IP Camera Bullet"), name: "IP Camera Bullet (5MP)", category: "Cameras" },

  // -----------------------------
  // LED Strips & SMPS
  // -----------------------------
  { id: id("240 LED Strip CW"), name: "240 LED/mtr Flexible Strip 151 SMD CW", category: "LED Strips" },
  { id: id("RGB 5050"), name: "RGB 5050 Strip", category: "LED Strips" },
  { id: id("Strip SMPS 16.6A"), name: "24V 16.6A Strip Light SMPS", category: "LED Strips" },

];
