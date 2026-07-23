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
      'test-secret'
    )
  })

  it('supabaseAdmin should throw if env vars missing', () => {
    delete process.env.SUPABASE_URL
    delete process.env.SUPABASE_SECRET_KEY
    
    expect(() => supabaseAdmin()).toThrow('Missing Supabase URL or Secret Key')
  })
})