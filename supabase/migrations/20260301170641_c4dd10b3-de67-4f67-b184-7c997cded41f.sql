-- Create articles table for the daily newspaper
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  category TEXT NOT NULL,
  original_url TEXT,
  relevance_score INTEGER DEFAULT 5,
  impact_on_israel TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public read access
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Articles are publicly readable" ON public.articles
  FOR SELECT USING (true);

CREATE POLICY "Articles can be inserted" ON public.articles
  FOR INSERT WITH CHECK (true);