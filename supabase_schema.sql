-- ============================================================
-- BIZFLOW — SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor (supabase.com → project → SQL Editor)
-- ============================================================


-- 1. PROFILES (linked to Supabase Auth users)
-- ============================================================

CREATE TABLE profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    email       TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);


-- Auto-create profile on signup
-- The business_name is passed via user_metadata during signUp()

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, business_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'business_name', 'My Business'),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. SALES
-- ============================================================

CREATE TABLE sales (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    quantity     NUMERIC(12, 2) NOT NULL DEFAULT 0,
    unit         TEXT NOT NULL DEFAULT 'pieces',
    amount       NUMERIC(12, 2) NOT NULL DEFAULT 0,
    sale_date    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sales"
    ON sales FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sales"
    ON sales FOR INSERT
    WITH CHECK (auth.uid() = user_id);


-- 3. EXPENSES
-- ============================================================

CREATE TABLE expenses (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    expense_name  TEXT NOT NULL,
    amount        NUMERIC(12, 2) NOT NULL DEFAULT 0,
    expense_date  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own expenses"
    ON expenses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
    ON expenses FOR INSERT
    WITH CHECK (auth.uid() = user_id);


-- 4. INVENTORY
-- ============================================================

CREATE TABLE inventory (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    quantity     NUMERIC(12, 2) NOT NULL DEFAULT 0,
    unit         TEXT NOT NULL DEFAULT 'pieces',
    price        NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own inventory"
    ON inventory FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory"
    ON inventory FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventory"
    ON inventory FOR UPDATE
    USING (auth.uid() = user_id);
