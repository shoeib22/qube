// Sample products to add manually via Firebase Console
// Copy each product object and add as a new document

const sampleProducts = [
    {
        // Document ID: red-smart-remote
        id: "red-smart-remote",
        name: "RED-Smart Remote",
        category: "Plugs & IR",
        description: "Universal smart remote control for home automation. Control all your IR devices from your smartphone.",
        price: 2999,
        images: ["/images/products/red-smart-remote.png"],
        primaryImage: "/images/products/red-smart-remote.png",
        specifications: {
            "Connectivity": "WiFi",
            "Power": "5V DC",
            "Warranty": "1 Year"
        },
        isActive: true,
        stock: 100
    },
    {
        // Document ID: hd-plug-16a-v2
        id: "hd-plug-16a-v2",
        name: "HD Plug 16A V2",
        category: "Plugs & IR",
        description: "Smart plug with 16A capacity. Control your appliances remotely with scheduling and energy monitoring.",
        price: 1999,
        images: ["/images/products/hd-plug-16a-v2.png"],
        primaryImage: "/images/products/hd-plug-16a-v2.png",
        specifications: {
            "Connectivity": "WiFi",
            "Max Load": "16A",
            "Warranty": "1 Year"
        },
        isActive: true,
        stock: 100
    },
    {
        // Document ID: lpf-1-switch
        id: "lpf-1-switch",
        name: "LPF 1 Switch (16A - Relay)",
        category: "Switches",
        description: "Single gang smart switch with 16A relay. Perfect for controlling lights and fans.",
        price: 1499,
        images: ["/images/products/lpf-1-switch.png"],
        primaryImage: "/images/products/lpf-1-switch.png",
        specifications: {
            "Connectivity": "WiFi",
            "Type": "Relay",
            "Load": "16A",
            "Warranty": "1 Year"
        },
        isActive: true,
        stock: 100
    }
];

// Instructions:
// 1. Go to Firebase Console → Firestore Database
// 2. Click on 'products' collection
// 3. Click 'Add document'
// 4. Set Document ID to the 'id' value (e.g., "red-smart-remote")
// 5. Add each field from the object above
// 6. For 'images' field: select 'array' type, then add string values
// 7. For 'specifications' field: select 'map' type, then add key-value pairs
// 8. Add 'createdAt' and 'updatedAt' as timestamp fields (current time)
// 9. Click 'Save'

console.log('Sample products ready for manual addition');
console.log('Total sample products:', sampleProducts.length);
