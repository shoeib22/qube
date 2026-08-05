-- CreateTable
CREATE TABLE "xerovolt_profiles" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" TEXT NOT NULL DEFAULT 'customer',
    "legacyFirebaseUid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "xerovolt_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xerovolt_products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "xerovolt_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xerovolt_orders" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "items" JSONB NOT NULL,
    "customerInfo" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT NOT NULL,
    "paymentDetails" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "xerovolt_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xerovolt_erv_leads" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "contact" TEXT,
    "product" TEXT NOT NULL DEFAULT 'ERV',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xerovolt_erv_leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "xerovolt_profiles_email_key" ON "xerovolt_profiles"("email");
CREATE UNIQUE INDEX "xerovolt_profiles_legacyFirebaseUid_key" ON "xerovolt_profiles"("legacyFirebaseUid");
CREATE UNIQUE INDEX "xerovolt_orders_orderId_key" ON "xerovolt_orders"("orderId");
CREATE UNIQUE INDEX "xerovolt_orders_transactionId_key" ON "xerovolt_orders"("transactionId");
CREATE INDEX "xerovolt_orders_userId_idx" ON "xerovolt_orders"("userId");

-- Row Level Security
--
-- Prisma/the app connects with a role that bypasses RLS (same as osteq-platform), so these
-- policies exist purely as defense-in-depth against PostgREST/anon-key access to the
-- public schema — PGRST_DB_SCHEMAS on this Supabase instance exposes every public table by
-- default, so without RLS these would be as wide open as the Firestore rules they replace
-- (`allow read, write: if true`).
ALTER TABLE "xerovolt_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "xerovolt_products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "xerovolt_orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "xerovolt_erv_leads" ENABLE ROW LEVEL SECURITY;

-- Products: public read of active listings only. All writes go through the app's
-- admin routes (service-role client, bypasses RLS) — no write policy needed.
CREATE POLICY "xerovolt_products_public_read" ON "xerovolt_products"
    FOR SELECT
    USING ("isActive" = true);

-- Profiles: a user can read/update only their own row.
CREATE POLICY "xerovolt_profiles_self_read" ON "xerovolt_profiles"
    FOR SELECT
    USING (auth.uid()::text = "id");

CREATE POLICY "xerovolt_profiles_self_update" ON "xerovolt_profiles"
    FOR UPDATE
    USING (auth.uid()::text = "id");

-- Orders: a user can read only orders placed under their own user id. Guest-checkout
-- orders (synthetic "USER_<uuid>" ids, see app/api/payment/phonepe/initiate) are not
-- readable via PostgREST by anyone — only through the app's own service-role queries.
CREATE POLICY "xerovolt_orders_self_read" ON "xerovolt_orders"
    FOR SELECT
    USING (auth.uid()::text = "userId");

-- ERV leads: no PostgREST policy at all — submission and reads only happen through the
-- app's own service-role route.
