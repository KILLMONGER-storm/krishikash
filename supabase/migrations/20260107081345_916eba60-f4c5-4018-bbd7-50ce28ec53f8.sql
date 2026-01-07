-- Create game_saves table to store player progress
CREATE TABLE public.game_saves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_state JSONB NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  goal_name TEXT,
  month INTEGER NOT NULL DEFAULT 1,
  savings NUMERIC NOT NULL DEFAULT 0,
  stability_score INTEGER NOT NULL DEFAULT 55,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.game_saves ENABLE ROW LEVEL SECURITY;

-- Users can only view their own save
CREATE POLICY "Users can view their own save"
ON public.game_saves
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own save
CREATE POLICY "Users can create their own save"
ON public.game_saves
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own save
CREATE POLICY "Users can update their own save"
ON public.game_saves
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own save
CREATE POLICY "Users can delete their own save"
ON public.game_saves
FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_game_saves_updated_at
BEFORE UPDATE ON public.game_saves
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();