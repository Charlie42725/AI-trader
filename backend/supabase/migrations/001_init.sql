-- ============================================================================
-- TradingAgents App — Initial Schema Migration
-- ============================================================================

-- 1. profiles (linked to auth.users)
CREATE TABLE public.profiles (
    id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name    text NOT NULL DEFAULT '交易用戶',
    avatar_url      text,
    plan            text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'pro_max')),
    credits         integer NOT NULL DEFAULT 5,
    language        text NOT NULL DEFAULT 'zh-TW',
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

-- 2. analysis_jobs
CREATE TABLE public.analysis_jobs (
    id                      text PRIMARY KEY,
    user_id                 uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status                  text NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    ticker                  text NOT NULL,
    date                    text NOT NULL,
    analysts                jsonb NOT NULL DEFAULT '["market","social","news","fundamentals"]',
    max_debate_rounds       integer NOT NULL DEFAULT 1,
    max_risk_discuss_rounds integer NOT NULL DEFAULT 1,
    llm_provider            text NOT NULL DEFAULT 'openai',
    signal                  text,
    result                  jsonb,
    progress                jsonb,
    error                   text,
    created_at              timestamptz NOT NULL DEFAULT now(),
    completed_at            timestamptz
);

CREATE INDEX idx_analysis_jobs_user_id ON public.analysis_jobs(user_id);
CREATE INDEX idx_analysis_jobs_status ON public.analysis_jobs(status);

-- 3. credit_transactions
CREATE TABLE public.credit_transactions (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount      integer NOT NULL,
    reason      text NOT NULL CHECK (reason IN ('analysis', 'purchase', 'refund', 'plan_grant')),
    job_id      text REFERENCES public.analysis_jobs(id) ON DELETE SET NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions(user_id);

-- ============================================================================
-- Row Level Security
-- ============================================================================

-- profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- analysis_jobs
ALTER TABLE public.analysis_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own jobs"
    ON public.analysis_jobs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jobs"
    ON public.analysis_jobs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- credit_transactions
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
    ON public.credit_transactions FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================================================
-- Trigger: auto-create profile on sign-up
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, plan, credits, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', '交易用戶'),
        'free',
        5,
        now(),
        now()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- Trigger: auto-update updated_at on profiles
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
