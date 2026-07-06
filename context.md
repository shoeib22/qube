# Xerovolt Project Context

**Last Updated**: 2026-07-07  
**Project Name**: xerovolt-tech  
**Version**: 0.1.0  
**Repository**: C:\Users\Shoeii\qube-1

---

## Project Overview

**Xerovolt** is a Next.js-based e-commerce platform specializing in smart home automation and intelligent electrical products. The platform includes a sophisticated 3D product configurator, user authentication system, admin dashboard, and integrated payment processing.

### Purpose & Business Domain
- **E-commerce Platform**: Sell smart home automation products and customizable panel solutions
- **Target Products**: ERV systems, smart panels, audio-video solutions, home automation devices
- **Key Differentiator**: Interactive 3D configurator allowing customers to customize products before purchase

---

## Technology Stack

### Frontend & Framework
- **Framework**: Next.js 16.2.6 (App Router)
- **UI Library**: React 19.2.6
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.18 + PostCSS
- **3D Graphics**: Three.js 0.184.0 + React Three Fiber 10.0.0-alpha.2 + Drei 11.0.0-alpha.5
- **Animations**: Motion 12.23.26, Framer Motion (implied from codebase)
- **Icons**: Lucide React 0.560.0
- **Node Version**: >=20.9.0

### Backend & Database
- **Authentication**: Firebase Auth + Custom auth middleware
- **Database**: 
  - Firebase Firestore (primary)
  - Supabase (secondary, PostgreSQL-based)
- **Storage**: Firebase Storage + Google Cloud Storage
- **Admin SDK**: Firebase Admin SDK 12.7.0

### Third-Party Services
- **AI Integration**: OpenAI API 4.56.0 (for AI-powered features)
- **Payments**: PhonePe integration (Indian payment gateway)
- **Document Generation**: html2canvas 1.4.1, jspdf 4.2.1 (for order PDFs/exports)
- **Utilities**: 
  - MQTT 5.15.1 (IoT device communication)
  - js-cookie 3.0.7 (client-side cookie management)
  - uuid 9.0.1 (ID generation)
  - idb 8.0.3 (IndexedDB wrapper)

### Development Tools
- **Linting**: ESLint 9 + Next.js config
- **Type Definitions**: Full TypeScript support with strict mode
- **Build System**: Turbopack (configured in next.config.mjs)

---

## Project Structure

```
qube-1/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home page (landing)
│   ├── layout.tsx                # Root layout
│   ├── shop/                     # E-commerce shop
│   │   ├── page.tsx              # Shop listing with filtering
│   │   └── Products/[id]/        # Product detail page
│   ├── configurator/             # 3D product configurator
│   │   ├── page.tsx              # Main configurator entry
│   │   ├── color/                # Color selection
│   │   ├── material/             # Material selection
│   │   ├── size/                 # Size/dimensions
│   │   ├── technology/           # Tech specs selection
│   │   ├── accessories/          # Add-ons
│   │   ├── panel/                # Panel design
│   │   ├── icons/                # Icon customization
│   │   └── cart/                 # Configurator cart
│   ├── dashboard/                # User dashboards
│   │   ├── user/                 # User profile dashboard
│   │   └── admin/                # Admin panel
│   │       ├── orders/           # Order management
│   │       ├── users/            # User management
│   │       ├── devices/          # Device management
│   │       └── configs/          # Configuration management
│   ├── auth/                     # Authentication flows
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   ├── cart/                     # Shopping cart
│   ├── checkout/                 # Checkout flow
│   ├── payment/                  # Payment processing
│   ├── orders/                   # Order history
│   ├── profile/                  # User profile
│   ├── wishlist/                 # Saved items
│   ├── returns/                  # Return management
│   ├── support/                  # Support page
│   ├── contact/                  # Contact form
│   ├── contact-support/          # Support contact
│   ├── services/                 # Service pages
│   ├── smart-panels/             # Smart panels info
│   ├── home-automation/          # Home automation info
│   ├── audio-video/              # Audio/video products
│   ├── software-development/     # Software services
│   ├── ERV/                      # ERV system info
│   ├── security/                 # Security info
│   ├── settings/                 # User settings
│   ├── PrivacyPolicy/
│   └── termsandconditions/
│
├── components/                   # React components
│   ├── Header.tsx                # Main navigation
│   ├── Footer.tsx                # Footer
│   ├── Hero.tsx                  # Hero section
│   ├── auth/
│   │   ├── AuthProvider.tsx      # Auth context provider
│   │   ├── RequireAuth.tsx       # Protected route wrapper
│   │   ├── UserMenu.tsx          # User dropdown menu
│   │   └── LoginButton.tsx       # Login button component
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── FeatureGrid.tsx
│   │   ├── Section.tsx
│   │   ├── Stats.tsx
│   │   ├── QuoteSection.tsx
│   │   ├── ScrollSections.tsx
│   │   ├── SmartSolutions.tsx
│   │   ├── AddToCartButton.tsx
│   │   └── LoadingSkeleton.tsx
│   ├── configurator/
│   │   ├── ConfiguratorLayout.tsx
│   │   ├── PanelPreview.tsx      # 3D panel preview
│   │   └── StepProgress.tsx
│   ├── ai/                       # AI features
│   │   ├── PromptForm.tsx
│   │   ├── AIResults.tsx
│   │   └── AILoader.tsx
│   ├── Scene.tsx                 # Three.js scene setup
│   ├── PanelCanvas.tsx           # 3D canvas for panels
│   ├── CycleVisualization.tsx    # Data visualization
│   ├── ProtectedRoute.tsx
│   ├── StatusBar.tsx
│   ├── Toolbar.tsx
│   ├── ShareButton.tsx
│   ├── ExploreCore.tsx
│   └── FAQ.tsx
│
├── lib/                          # Utility libraries & services
│   ├── firebase.ts               # Firebase client config
│   ├── firebaseAdmin.ts          # Firebase admin SDK
│   ├── firestoreService.ts       # Firestore CRUD operations
│   ├── auth.ts                   # Auth utilities
│   ├── auth-middleware.ts        # Auth middleware
│   ├── getUserRole.ts            # Role checking
│   ├── ai.ts                     # OpenAI integration
│   ├── db.ts                     # Database utilities
│   ├── storage-helpers.ts        # Storage operations
│   ├── Storageservice.ts         # Storage service
│   ├── phonepe.ts                # PhonePe payment integration
│   ├── svgExport.ts              # SVG/PDF export utilities
│   ├── configuratorData.ts       # Configurator state/data
│   ├── panelLayout.ts            # Panel layout logic
│   ├── iconLibrary.ts            # Icon management
│   └── utils.ts                  # General utilities
│
├── context/                      # React Context API
│   └── [context files]           # State management
│
├── hooks/                        # Custom React hooks
│   └── [hook files]              # Custom hooks
│
├── types/                        # TypeScript type definitions
│   └── [type definitions]
│
├── public/                       # Static assets
│   └── logo/                     # Logo assets
│
├── styles/                       # Global styles
│   └── [stylesheet files]
│
├── scripts/                      # Utility scripts
│   ├── migrate-products.js       # Database migration
│   └── make-admin.js             # Admin setup script
│
├── next.config.mjs               # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind configuration
├── eslint.config.mjs             # ESLint configuration
├── firebase.json                 # Firebase configuration
├── firestore.rules               # Firestore security rules
├── apphosting.yaml               # App hosting config
├── instrumentation.js            # Monitoring/instrumentation
└── package.json                  # Dependencies & scripts
```

---

## Key Features

### 1. **Product Shop** (`/shop`)
- Browse products with category filtering
- Product detail pages with images and descriptions
- Add to cart functionality
- Product search and filtering

### 2. **3D Configurator** (`/configurator`)
- Interactive 3D product customization
- Multi-step configuration flow:
  - Color selection
  - Material selection
  - Size/dimensions
  - Technology features
  - Accessories
  - Panel design with custom icons
- Real-time 3D preview using Three.js
- Save configured products to cart

### 3. **User Authentication & Profiles**
- User registration and login
- Email verification (Firebase Auth)
- Password reset functionality
- User profile management
- Personalized dashboard

### 4. **Shopping Features**
- Shopping cart management
- Wishlist functionality
- Order history
- Returns management
- Checkout process
- Payment integration (PhonePe)

### 5. **Admin Dashboard** (`/dashboard/admin`)
- Order management and tracking
- User management
- Device/product management
- Configuration management
- Sales analytics (Stats component)

### 6. **AI Integration**
- AI-powered product recommendations/analysis
- PromptForm for user queries
- AI Results display with structured responses
- OpenAI API integration

### 7. **Content Pages**
- Services overview
- Smart panels information
- Home automation solutions
- Audio/video products
- ERV system details
- Security information
- Support pages
- Contact forms

---

## Firebase Setup

### Project ID
```
cube-8c773
```

### Key Services
- **Authentication**: Firebase Auth (email/password)
- **Firestore**: Document database for users, orders, products, configurations
- **Storage**: Cloud Storage for product images and user uploads
- **Hosting**: Firebase Hosting (configured in .firebaserc)

### Environment Variables (.env.local)
```
FIREBASE_PROJECT_ID = "cube-8c773"
FIREBASE_CLIENT_EMAIL = "[service-account-email]"
FIREBASE_PRIVATE_KEY = "[private-key]"
```

### Security Rules
- Firestore rules defined in `firestore.rules`
- Access control based on user authentication
- Admin-only operations for sensitive endpoints

---

## Database & Storage

### Firestore Collections (Inferred)
- **users**: User profiles and account data
- **orders**: Order information and history
- **products**: Product catalog
- **configurations**: Saved product configurations
- **devices**: IoT device data
- **configs**: System configurations

### Firebase Storage Paths
- `/api/products/` - Product images
- `/logo/` - Logo assets
- User uploads and documents

### Supabase Integration
- Secondary database option (PostgreSQL)
- Edge functions capability
- Real-time updates potential

---

## Authentication & Authorization

### Auth Flow
1. User registration/login via Firebase Auth
2. JWT token stored in cookies
3. Auth middleware validates requests
4. Role-based access control (user/admin)

### Protected Routes
- Dashboard pages require authentication
- Admin pages require admin role
- Configurator accessible to authenticated users
- Checkout requires authentication

### User Roles
- **User**: Standard user (can shop, configure, place orders)
- **Admin**: Full administrative access (manage orders, users, products)

---

## API Endpoints (Next.js API Routes)

### Product APIs
- `GET /api/products` - List all products
- `GET /api/products/[id]` - Get product details

### Expected API Patterns
- Authentication endpoints
- Order management
- User profile endpoints
- Admin management endpoints
- Payment endpoints
- AI endpoints

---

## Important Scripts

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Utilities
```bash
npm run migrate:products   # Migrate product data
npm run make-admin         # Make a user an admin
```

---

## Configuration Notes

### Turbopack
- Configured to use project root as workspace root
- Prevents CSS recompilation issues

### Image Optimization
- Local patterns: `/logo/**`, `/api/products/**`
- Remote patterns: Google Cloud Storage, Firebase Storage

### Build & Deploy
- Next.js 16 (latest App Router)
- Firebase Hosting support
- Environment-based configuration

---

## Recent Commits (Git History)

```
cd3ebc7 - fix all eslint and typescript problems across the project
1de521a - show configurator banner unconditionally in shop
29c9c1a - mobile optimisation across all pages and shop configurator button
4468595 - optimise mobile layout and fix support page colours
a8bf269 - fix admin pages stuck on loading when unauthenticated
```

---

## Active Development Status

- ✅ Core e-commerce functionality
- ✅ 3D configurator with Three.js
- ✅ User authentication system
- ✅ Admin dashboard
- ✅ Payment integration (PhonePe)
- ✅ Firebase/Supabase integration
- ✅ Mobile optimization (recent work)
- 🔄 Ongoing: ESLint/TypeScript improvements
- 🔄 Ongoing: Mobile responsive design refinement

---

## Common Tasks & Workflows

### Adding a New Product
1. Add product data to Firestore
2. Upload product images to Firebase Storage
3. Configure product in admin dashboard

### Creating a New Page
1. Create page.tsx in `app/` directory
2. Import Header and Footer components
3. Use Tailwind CSS for styling
4. Add to navigation if needed

### Modifying the Configurator
1. Edit configurator pages in `app/configurator/`
2. Update PanelPreview.tsx for 3D preview
3. Modify ConfiguratorLayout.tsx for step flow
4. Test with 3D canvas

### Admin Operations
1. Access `/dashboard/admin`
2. Requires admin authentication
3. Manage users, orders, products, configs

---

## Useful Files Reference

| File | Purpose |
|------|---------|
| `next.config.mjs` | Next.js build & image optimization config |
| `tailwind.config.ts` | Design system (colors, fonts, spacing) |
| `tsconfig.json` | TypeScript strict mode settings |
| `firebase.json` | Firebase hosting config |
| `firestore.rules` | Database security rules |
| `lib/firebase.ts` | Firebase client initialization |
| `lib/firestoreService.ts` | Database operation helpers |
| `components/auth/AuthProvider.tsx` | Auth context setup |

---

## Notes for Future Work

1. **Performance**: Consider optimizing 3D rendering for mobile
2. **Scalability**: Monitor Firestore read/write costs
3. **Security**: Regularly audit Firestore rules
4. **Testing**: Implement comprehensive E2E tests for checkout flow
5. **Analytics**: Track user configurator usage for UX improvements
6. **Accessibility**: Ensure 3D components have alt text and keyboard controls

---

## Support & Troubleshooting

### Common Issues
- **CSS not recompiling**: Check Turbopack root configuration
- **Firebase errors**: Verify environment variables and security rules
- **3D rendering lag**: Check Three.js performance, reduce polygon count
- **Auth failures**: Check token expiration in cookies

### Debug Tips
- Use `npm run lint` to catch TypeScript errors early
- Check browser DevTools Network tab for API calls
- Monitor Firebase Firestore quota in console
- Test mobile responsiveness with Chrome DevTools

---

**Generated**: 2026-07-07  
**For Quick Reference**: See MEMORY.md for indexed project knowledge base
