-- Supabase Schema for HarMo Space 360

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  phone_number TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin', 'suspended')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pinned_doc_ids TEXT[] DEFAULT '{}'
);

-- 2. Documents Table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('pdf', 'docx')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT DEFAULT 'General',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  file_size BIGINT,
  views INTEGER DEFAULT 0
);

-- 3. Lost & Found Table
CREATE TABLE IF NOT EXISTS lost_found (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('lost', 'found')),
  location TEXT,
  date TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  author_phone TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Businesses (Marketplace) Table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price TEXT,
  category TEXT DEFAULT 'General',
  location TEXT,
  contact_phone TEXT,
  image_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  viewed_by UUID[] DEFAULT '{}'
);

-- 5. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- NULL means global
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE,
  read BOOLEAN DEFAULT FALSE,
  show_on_home BOOLEAN DEFAULT FALSE
);

-- Notifications Policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own or global notifications" ON notifications FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all notifications" ON notifications FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- RLS Policies

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can delete profiles" ON profiles FOR DELETE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved documents are viewable by everyone" ON documents FOR SELECT USING (status = 'approved' OR auth.uid() = author_id);
CREATE POLICY "Authenticated users can insert documents" ON documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own documents" ON documents FOR UPDATE USING ((auth.uid() = author_id AND status != 'approved') OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Users can delete own documents" ON documents FOR DELETE USING ((auth.uid() = author_id AND status != 'approved') OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Lost & Found
ALTER TABLE lost_found ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lost & Found items are viewable by everyone" ON lost_found FOR SELECT USING (status = 'approved' OR auth.uid() = author_id);
CREATE POLICY "Authenticated users can insert lost_found" ON lost_found FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own lost_found" ON lost_found FOR UPDATE USING (auth.uid() = author_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Users can delete own lost_found" ON lost_found FOR DELETE USING (auth.uid() = author_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Businesses
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Businesses are viewable by everyone" ON businesses FOR SELECT USING (status = 'approved' OR auth.uid() = author_id);
CREATE POLICY "Authenticated users can insert businesses" ON businesses FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own businesses" ON businesses FOR UPDATE USING (auth.uid() = author_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Users can delete own businesses" ON businesses FOR DELETE USING (auth.uid() = author_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Storage Buckets (Run these in the Supabase SQL Editor if needed, but usually done via UI)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);

-- Storage Policies for 'documents' bucket
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
-- CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
