import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);
    return await this.prisma.user.create({
      data: {
        email: createAuthDto.email,
        //name: createAuthDto.name,
        password: hashedPassword,
        role: 'user',
      } as any,
    });
  }

  // Login: verify credentials and issue JWT with role
  async login(createAuthDto: CreateAuthDto) {
    if (!createAuthDto.email) {
      throw new UnauthorizedException('Email is required');
    }
    const user = await this.prisma.user.findUnique({
      where: { email: createAuthDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(createAuthDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);
    return { access_token: token, user: { id: user.id, email: user.email, role: user.role } };
  }

  // Ensure admin user exists (without rewriting the password every boot)
  async ensureAdminUser() {
    const adminEmail = process.env.ADMIN_USER_EMAIL;
    const adminName = process.env.ADMIN_USER_NAME;
    const adminPassword = process.env.ADMIN_USER_PASSWORD;

    if (!adminEmail || !adminName || !adminPassword) {
      console.warn('ADMIN_USER_EMAIL/NAME/PASSWORD missing; admin bootstrap skipped.');
      return;
    }

    const existing = await this.prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await this.prisma.user.create({
        data: {
          email: adminEmail,
          name: adminName,
          password: hashedPassword,
          role: 'admin',
        },
      });
      return;
    }

    // If admin exists, only update password if it changed
    const passwordChanged = !(await bcrypt.compare(adminPassword, existing.password));
    if (passwordChanged || existing.role !== 'admin') {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await this.prisma.user.update({
        where: { email: adminEmail },
        data: { password: hashedPassword, role: 'admin' },
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
