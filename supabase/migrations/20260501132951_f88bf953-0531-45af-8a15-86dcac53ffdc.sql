-- Appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create appointments"
  ON public.appointments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated staff can view appointments"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated staff can update appointments"
  ON public.appointments FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated staff can delete appointments"
  ON public.appointments FOR DELETE
  TO authenticated
  USING (true);

-- Chatbot leads
CREATE TABLE public.chatbot_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chatbot_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create chatbot leads"
  ON public.chatbot_leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated staff can view chatbot leads"
  ON public.chatbot_leads FOR SELECT
  TO authenticated
  USING (true);