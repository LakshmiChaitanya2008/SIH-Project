import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars.')
  console.error('   Set them in .env or pass via environment.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const DEMO_USERS = [
  {
    email: 'citizen@samadhansetu.in', password: 'citizen123',
    full_name: 'Ramesh Sharma', role: 'CITIZEN',
    district: 'Gumla', state: 'Jharkhand', institution: 'Community Member',
    phone: '+91 94311 88221',
  },
  {
    email: 'admin@samadhansetu.in', password: 'admin123',
    full_name: 'SamadhanSetu Administration', role: 'ADMIN',
    district: 'Ranchi', state: 'Jharkhand',
    institution: 'Jharkhand Civic Innovation Mission',
    phone: '+91 651 2200112',
  },
  {
    email: 'admin@samadhansetu.gov.in', password: 'admin123',
    full_name: 'SamadhanSetu Administration', role: 'ADMIN',
    district: 'Ranchi', state: 'Jharkhand',
    institution: 'Jharkhand Civic Innovation Mission',
    phone: '+91 651 2200112',
  },
  {
    email: 'student@demo.ac.in', password: 'student123',
    full_name: 'Aarav Kumar', role: 'STUDENT',
    district: 'Ranchi', state: 'Jharkhand',
    institution: 'BIT Mesra Innovation Club',
    phone: '+91 98351 12345',
  },
  {
    email: 'partner@samadhansetu.in', password: 'partner123',
    full_name: 'Jharkhand Water Mission', role: 'PARTNER',
    district: 'Ranchi', state: 'Jharkhand',
    institution: 'Partner Organization',
    phone: '+91 94311 99887',
  },
]

const SCHEMA_SQL = `
-- Add profile columns to public.users (idempotent)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Jharkhand';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS institution TEXT;

-- Auto-create public.users profile on Supabase Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, district, state, institution, phone, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(UPPER(NEW.raw_user_meta_data->>'role'), 'CITIZEN'),
    COALESCE(NEW.raw_user_meta_data->>'district', 'Gumla'),
    COALESCE(NEW.raw_user_meta_data->>'state', 'Jharkhand'),
    NEW.raw_user_meta_data->>'institution',
    NEW.phone,
    'ACTIVE'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    email = COALESCE(EXCLUDED.email, public.users.email),
    last_login_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
`

async function seedUsers() {
  console.log('🔧 Running schema migrations...')
  
  // Run schema SQL statements one by one
  const statements = SCHEMA_SQL.split(';').map(s => s.trim()).filter(s => s.length > 0)
  for (const stmt of statements) {
    try {
      // Use the REST SQL endpoint via rpc or direct query
      const { error } = await supabase.rpc('exec_sql', { sql: stmt + ';' })
      if (error) {
        // Try direct approach if rpc doesn't exist
        console.warn(`   ⚠ SQL via RPC failed (expected if exec_sql not defined): ${error.message}`)
      }
    } catch (err) {
      // Silently continue — user can run SQL manually
    }
  }
  console.log('   ℹ If schema SQL failed, run the SQL manually in Supabase Dashboard → SQL Editor')
  console.log('')

  console.log('👤 Seeding demo users...')
  for (const u of DEMO_USERS) {
    process.stdout.write(\`   \${u.email} ... \`)

    // Create in auth.users via admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: {
        full_name: u.full_name,
        role: u.role,
        district: u.district,
        state: u.state,
        institution: u.institution,
        phone: u.phone,
      },
    })

    if (error) {
      if (error.message?.includes('already been registered') || error.message?.includes('already exists')) {
        console.log('✓ already exists')

        // Still ensure public.users row exists with correct data
        // Look up the user by email
        const { data: existingUsers } = await supabase.auth.admin.listUsers()
        const existing = existingUsers?.users?.find(eu => eu.email === u.email)
        if (existing) {
          await supabase.from('users').upsert({
            id: existing.id,
            email: u.email,
            full_name: u.full_name,
            role: u.role,
            district: u.district,
            state: u.state,
            institution: u.institution,
            phone: u.phone,
            status: 'ACTIVE',
          }, { onConflict: 'id' })
        }
      } else {
        console.log(\`✗ \${error.message}\`)
      }
      continue
    }

    // Upsert into public.users (trigger may handle this, but be safe)
    if (data?.user) {
      await supabase.from('users').upsert({
        id: data.user.id,
        email: u.email,
        full_name: u.full_name,
        role: u.role,
        district: u.district,
        state: u.state,
        institution: u.institution,
        phone: u.phone,
        status: 'ACTIVE',
      }, { onConflict: 'id' })
    }

    console.log('✓ created')
  }

  console.log('')
  console.log('✅ Demo user seeding complete!')
  console.log('')
  console.log('Demo credentials:')
  console.log('  citizen@samadhansetu.in     / citizen123')
  console.log('  admin@samadhansetu.in       / admin123')
  console.log('  admin@samadhansetu.gov.in   / admin123')
  console.log('  student@demo.ac.in          / student123')
  console.log('  partner@samadhansetu.in     / partner123')
}

seedUsers().catch(err => {
  console.error('\n❌ Seed failed:', err.message)
  process.exit(1)
})
