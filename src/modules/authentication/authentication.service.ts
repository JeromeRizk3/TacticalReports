import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class AuthenticationService {
  private users: User[] = [
    {
      id: '507f1f77bcf86cd799439010',
      email: 'demo@example.com',
      password: 'demo123',
      firstName: 'Demo',
      lastName: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '507f1f77bcf86cd799439011',
      email: 'demo2@example.com',
      password: 'demo123',
      firstName: 'Demo2',
      lastName: 'User2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '507f1f77bcf86cd799439012',
      email: 'demo3@example.com',
      password: 'demo123',
      firstName: 'Demo3',
      lastName: 'User3',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '507f1f77bcf86cd799439013',
      email: 'demo4@example.com',
      password: 'demo123',
      firstName: 'Demo4',
      lastName: 'User4',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '507f1f77bcf86cd799439014',
      email: 'demo5@example.com',
      password: 'demo123',
      firstName: 'Demo5',
      lastName: 'User5',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = this.users.find(
      (u) => u.email === email && u.password === password,
    );
    return user ?? null;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { accessToken: `fake-token-for-${user.id}` };
  }
}
