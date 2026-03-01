import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticationService],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('user lifecycle', () => {
    const sample = {
      email: 'test@example.com',
      password: 'secret',
      firstName: 'Test',
      lastName: 'User',
    };

    it('can register and then login with correct credentials', async () => {
      const created = await service.createUser(sample);
      expect(created.id).toBeDefined();
      expect(created.email).toBe(sample.email);

      const token = await service.login({ email: sample.email, password: sample.password });
      expect(token).toHaveProperty('accessToken');
      expect(typeof token.accessToken).toBe('string');
    });

    it('rejects wrong password', async () => {
      await service.createUser(sample);
      await expect(service.login({ email: sample.email, password: 'wrong' })).rejects.toThrow();
    });

    it('validateUser returns null for non-existent', async () => {
      const result = await service.validateUser('nope@example.com', 'anything');
      expect(result).toBeNull();
    });
  });
});
