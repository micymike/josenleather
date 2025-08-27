import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto);
  }

  @Post()
  @ApiBody({
    description: 'User credentials for authentication',
    type: CreateAuthDto,
    examples: {
      valid: {
        summary: 'Valid payload',
        value: {
          username: 'David Ngesa',
          password: 'josenleather@2025',
        },
      },
    },
  })
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  // Login endpoint: returns JWT with user id, email, and role
  @Post('login')
  @ApiBody({
    description: 'User login',
    type: CreateAuthDto,
    examples: {
      admin: {
        summary: 'Admin login',
        value: {
          username: 'David Ngesa',
          password: 'josenleather@2025',
        },
      },
    },
  })
  async login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
