import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAuthDto: CreateAuthDto) {
    // Create a new user for authentication
    return await this.prisma.user.create({
      data: {
        email: createAuthDto.username,
        password: createAuthDto.password,
        role: 'user',
      },
    });
  }

  // Login: verify credentials and issue JWT with role
  async login(createAuthDto: CreateAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: createAuthDto.username },
    });
    if (!user || user.password !== createAuthDto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Issue JWT with id, email, role
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const secret = process.env.JWT_SECRET || 'default_jwt_secret';
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });
    return { access_token: token, user: { id: user.id, email: user.email, role: user.role } };
  }

  // Ensure admin user exists with hardcoded credentials
  async ensureAdminUser() {
    const adminEmail = process.env.ADMIN_USER_NAME;
    const adminPassword = process.env.ADMIN_USER_PASSWORD;
    const existing = await this.prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existing) {
      await this.prisma.user.create({
        data: {
          email: adminEmail as string,
          password: adminPassword,
          role: 'admin',
        },
      });
    }
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    return await this.prisma.user.update({
      where: { id },
      data: updateAuthDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }
}
