import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [AuthenticationService],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('registers a user and does not leak password', async () => {
    const dto = { email: 'c@test.com', password: '1234' };
    const result = await controller.register(dto as any);
    expect(result).toHaveProperty('email', dto.email);
    expect(result).not.toHaveProperty('password');
  });

  it('returns token from login', async () => {
    const dto = { email: 'b@test.com', password: 'abcd' };
    await service.createUser({ ...dto });
    const logged = await controller.login(dto as any);
    expect(logged).toHaveProperty('accessToken');
  });
});
