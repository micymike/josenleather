import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    if (!authHeader) return false;

    const token = authHeader.split(' ')[1];
    if (!token) return false;

    try {
      const payload = this.jwtService.verify(token);
      // Optionally, check for admin role in payload
      if (payload && payload.role === 'admin') {
        request['user'] = payload;
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }
}
