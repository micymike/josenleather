import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Missing Authorization header');

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) throw new UnauthorizedException('Invalid Authorization header format');

    try {
      const payload = this.jwtService.verify(token);
      if (!payload) throw new UnauthorizedException('Invalid token');
      // Require admin role for protected admin routes
      if (payload.role !== 'admin') throw new ForbiddenException('Insufficient permissions');
      (request as any).user = payload;
      return true;
    } catch (err) {
      if (err instanceof ForbiddenException || err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
