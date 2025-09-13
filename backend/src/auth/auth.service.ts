import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { supabase, supabaseAdmin } from '../supabase/supabase.client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);
    const { data, error } = await supabase
      .from('User')
      .insert([
        {
          email: createAuthDto.email,
          password: hashedPassword,
          role: 'user',
        }
      ])
      .select()
      .single();
    if (error) throw new UnauthorizedException(error.message);
    return data;
  }

  async login(createAuthDto: CreateAuthDto) {
    const adminEmail = process.env.ADMIN_USER_EMAIL?.replace(/"/g, '');
    const adminPassword = process.env.ADMIN_USER_PASSWORD;

    if (
      createAuthDto.email === adminEmail &&
      createAuthDto.password === adminPassword
    ) {
      const payload = {
        sub: 'admin',
        email: adminEmail,
        role: 'admin',
      };
      const token = this.jwtService.sign(payload);
      return { access_token: token, user: { id: 'admin', email: adminEmail, role: 'admin' } };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async ensureAdminUser() {
    const adminEmail = process.env.ADMIN_USER_EMAIL;
    const adminName = process.env.ADMIN_USER_NAME;
    const adminPassword = process.env.ADMIN_USER_PASSWORD;

    if (!adminEmail || !adminName || !adminPassword) {
      console.warn('ADMIN_USER_EMAIL/NAME/PASSWORD missing; admin bootstrap skipped.');
      return;
    }

    try {
      const { data: existing } = await supabaseAdmin
        .from('User')
        .select('*')
        .eq('email', adminEmail)
        .maybeSingle();

      if (!existing) {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: adminEmail,
          password: adminPassword,
          user_metadata: { name: adminName, role: 'admin' }
        });
        if (error) throw new UnauthorizedException(error.message);
        
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const { error: insertError } = await supabaseAdmin
          .from('User')
          .insert({
            id: data.user.id,
            email: adminEmail,
            name: adminName,
            password: hashedPassword,
            role: 'admin',
          });
        if (insertError) console.warn('User table insert failed:', insertError.message);
      }
    } catch (error) {
      console.warn('Admin user setup failed:', error.message);
    }
  }

  async findAll() {
    const { data, error } = await supabase.from('User').select('*');
    if (error) throw new UnauthorizedException(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new UnauthorizedException(error.message);
    return data;
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    const { data, error } = await supabase
      .from('User')
      .update(updateAuthDto)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new UnauthorizedException(error.message);
    return data;
  }

  async remove(id: string) {
    const { data, error } = await supabase
      .from('User')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw new UnauthorizedException(error.message);
    return data;
  }
}
