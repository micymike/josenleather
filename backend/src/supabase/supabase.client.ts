import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabaseClient: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL') || this.configService.get<string>('SUPABASE_PROJECT_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL or SUPABASE_PROJECT_URL is required in environment variables');
    }

    if (!supabaseKey) {
      throw new Error('SUPABASE_ANON_KEY is required in environment variables');
    }

    this.supabaseClient = createClient(supabaseUrl, supabaseKey);
  }

  get client(): SupabaseClient {
    return this.supabaseClient;
  }
}

// Legacy export for backward compatibility - will be lazy loaded
let legacyClient: SupabaseClient | null = null;
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    if (!legacyClient) {
      const supabaseUrl = process.env.SUPABASE_URL || process.env.SUPABASE_PROJECT_URL;
      const supabaseKey = process.env.SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseKey) {
        legacyClient = createClient(supabaseUrl, supabaseKey);
      } else {
        throw new Error('Supabase environment variables not loaded yet');
      }
    }
    return legacyClient[prop as keyof SupabaseClient];
  }
});

// Service role client for admin operations
let serviceRoleClient: SupabaseClient | null = null;
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    if (!serviceRoleClient) {
      const supabaseUrl = process.env.SUPABASE_URL || process.env.SUPABASE_PROJECT_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && serviceRoleKey) {
        serviceRoleClient = createClient(supabaseUrl, serviceRoleKey);
      } else {
        throw new Error('Supabase service role key not configured');
      }
    }
    return serviceRoleClient[prop as keyof SupabaseClient];
  }
});
