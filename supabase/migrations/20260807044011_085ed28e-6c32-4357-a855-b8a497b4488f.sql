CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.vehicle_category AS ENUM ('auto', 'car');
CREATE TYPE public.enquiry_kind AS ENUM ('enquiry', 'booking', 'finance');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category public.vehicle_category NOT NULL,
  name text NOT NULL,
  brand text NOT NULL,
  price integer NOT NULL DEFAULT 0,
  year integer,
  km_driven integer,
  images text[] NOT NULL DEFAULT '{}',
  colors text[] NOT NULL DEFAULT '{}',
  engine text NOT NULL DEFAULT '',
  seating integer NOT NULL DEFAULT 4,
  transmission text NOT NULL DEFAULT 'Manual',
  fuel text NOT NULL DEFAULT 'Petrol',
  in_stock boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.vehicles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicles TO authenticated;
GRANT ALL ON public.vehicles TO service_role;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vehicles are publicly viewable" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Admins manage vehicles" ON public.vehicles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER vehicles_updated_at BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.enquiry_kind NOT NULL DEFAULT 'enquiry',
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE SET NULL,
  vehicle_name text,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  city text,
  message text,
  preferred_date date,
  monthly_income integer,
  employment_type text,
  loan_amount integer,
  status text NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an enquiry" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read enquiries" ON public.enquiries FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update enquiries" ON public.enquiries FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete enquiries" ON public.enquiries FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER enquiries_updated_at BEFORE UPDATE ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text,
  rating integer NOT NULL DEFAULT 5,
  comment text NOT NULL,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved reviews are public" ON public.reviews FOR SELECT USING (approved = true);
CREATE POLICY "Anyone can submit a review" ON public.reviews FOR INSERT WITH CHECK (approved = false);
CREATE POLICY "Admins read all reviews" ON public.reviews FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update reviews" ON public.reviews FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete reviews" ON public.reviews FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.vehicles (category, name, brand, price, images, colors, engine, seating, transmission, fuel, in_stock, featured, description, sort_order) VALUES
('auto','Bajaj RE Compact','Bajaj',235000,ARRAY['https://images.unsplash.com/photo-1580494767050-8b3a2f0e0b0f?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1519055548599-6d4d129508c4?auto=format&fit=crop&w=1400&q=80'],ARRAY['Yellow','Green','Black'],'236cc / 10.2 bhp',4,'Manual','CNG',true,true,'Reliable city auto rickshaw with strong pickup and low running cost.',1),
('auto','Piaggio Ape City+','Piaggio',215000,ARRAY['https://images.unsplash.com/photo-1519055548599-6d4d129508c4?auto=format&fit=crop&w=1400&q=80'],ARRAY['Yellow','White'],'230cc / 8.7 bhp',4,'Manual','Diesel',true,false,'Compact, fuel-efficient auto — a favourite for local passenger routes.',2),
('auto','Mahindra Treo','Mahindra',285000,ARRAY['https://images.unsplash.com/photo-1617196701539-e88ae67f0f6f?auto=format&fit=crop&w=1400&q=80'],ARRAY['White','Blue'],'8 kW Electric',4,'Automatic','Electric',false,false,'Zero-emission electric auto rickshaw with low maintenance cost.',3),
('auto','TVS King Deluxe','TVS',205000,ARRAY['https://images.unsplash.com/photo-1597007519071-c1a5aebc4a44?auto=format&fit=crop&w=1400&q=80'],ARRAY['Yellow','Red'],'199cc / 7.4 bhp',4,'Manual','Petrol',true,false,'Smooth ride and refined engine — well-suited for daily commercial use.',4),
('car','Maruti Suzuki Swift VXi','Maruti Suzuki',585000,ARRAY['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80'],ARRAY['White','Red','Silver'],'1.2L / 89 bhp',5,'Manual','Petrol',true,true,'Popular hatchback with excellent mileage and easy service network.',1),
('car','Hyundai Creta SX','Hyundai',1250000,ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=80'],ARRAY['Black','White','Blue'],'1.5L / 113 bhp',5,'Automatic','Diesel',true,true,'Feature-rich compact SUV with premium interiors and strong performance.',2),
('car','Tata Nexon EV','Tata',1450000,ARRAY['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1400&q=80'],ARRAY['White','Blue','Grey'],'129 bhp Electric',5,'Automatic','Electric',true,false,'India''s popular electric SUV — long range and zero running fuel cost.',3),
('car','Honda City ZX','Honda',1180000,ARRAY['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80'],ARRAY['Silver','White','Black'],'1.5L / 119 bhp',5,'Automatic','Petrol',false,false,'Premium sedan with refined ride quality and a spacious cabin.',4),
('car','Mahindra Bolero','Mahindra',895000,ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=80'],ARRAY['White','Beige'],'1.5L / 74 bhp',7,'Manual','Diesel',true,false,'Rugged, dependable utility vehicle — built for rural and semi-urban roads.',5),
('car','Maruti Suzuki WagonR CNG','Maruti Suzuki',620000,ARRAY['https://images.unsplash.com/photo-1541348263662-e068662d82af?auto=format&fit=crop&w=1400&q=80'],ARRAY['Silver','White'],'1.0L / 67 bhp',5,'Manual','CNG',true,false,'Spacious tall-boy hatchback with factory-fitted CNG for very low running cost.',6);

INSERT INTO public.reviews (name, city, rating, comment, approved) VALUES
('Ramesh Yadav','Jangaon',5,'Bought my auto here. Paperwork was done in two days and the price was fair. Very helpful team.',true),
('Sunitha Reddy','Warangal',5,'They arranged finance against my car documents quickly and explained every charge clearly.',true),
('Kiran Kumar','Jangaon',4,'Good selection of second-hand cars. Srinu garu personally helped with the RC transfer.',true);