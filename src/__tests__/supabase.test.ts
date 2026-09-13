import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabaseAdmin } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Mock the Supabase modules
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

describe('Supabase Clients', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset environment variables
    process.env.SUPABASE_URL = 'https://test.supabase.co'
    process.env.SUPABASE_PUBLISHABLE_KEY = 'test-key'
    process.env.SUPABASE_SECRET_KEY = 'test-secret'
  })

  it('supabaseAdmin should create client with service role key', () => {
    supabaseAdmin()
    
    expect(createClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-secret',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  })

  it('supabaseAdmin should throw if env vars missing', () => {
    delete process.env.SUPABASE_URL
    delete process.env.SUPABASE_SECRET_KEY
    
    expect(() => supabaseAdmin()).toThrow('Missing Supabase URL or Secret Key')
  })
})

import { normalizePaper } from '@/lib/live-content'

describe('normalizePaper', () => {
  it('normalizes string authors into { name, slug, role } objects', () => {
    const rawPaper = {
      id: 'test-1',
      slug: 'test-slug',
      title: 'اختبار النواة',
      abstract: 'ملخص',
      authors: ['م. أحمد الفراتي', 'علي حسين هادي (Jemo)'],
    } as any

    const normalized = normalizePaper(rawPaper)
    expect(normalized.authors).toHaveLength(2)
    expect(normalized.authors[0]).toEqual({
      name: 'م. أحمد الفراتي',
      slug: 'م-أحمد-الفراتي',
      role: 'مؤلف',
    })
    expect(normalized.authors[1].name).toBe('علي حسين هادي (Jemo)')
  })

  it('preserves existing object authors safely', () => {
    const rawPaper = {
      id: 'test-2',
      slug: 'test-slug-2',
      title: 'بحث ثاني',
      abstract: 'ملخص',
      authors: [{ name: 'علي هادي', slug: 'ali-hadi', role: 'رئيس الباحثين' }],
    } as any

    const normalized = normalizePaper(rawPaper)
    expect(normalized.authors[0]).toEqual({
      name: 'علي هادي',
      slug: 'ali-hadi',
      role: 'رئيس الباحثين',
    })
  })
})