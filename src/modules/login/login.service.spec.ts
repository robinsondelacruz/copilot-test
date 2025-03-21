import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginService } from './login.service';
import { User } from '../user/user.entity';
import { LoginDto } from '../../dtos/login.dto';

describe('LoginService', () => {
  let loginService: LoginService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    loginService = module.get<LoginService>(LoginService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(loginService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if credentials are valid', async () => {
      const loginDto: LoginDto = {
        username: 'john_doe',
        password: 'password123',
      };
      const user = {
        id: 1,
        username: 'john_doe',
        password: await bcrypt.hash('password123', 10),
      };

      mockUserRepository.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await loginService.validateUser(loginDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { username: loginDto.username },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const loginDto: LoginDto = {
        username: 'nonexistent',
        password: 'password123',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await loginService.validateUser(loginDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { username: loginDto.username },
      });
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const loginDto: LoginDto = {
        username: 'john_doe',
        password: 'wrongpassword',
      };
      const user = {
        id: 1,
        username: 'john_doe',
        password: await bcrypt.hash('password123', 10),
      };

      mockUserRepository.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await loginService.validateUser(loginDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { username: loginDto.username },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
      expect(result).toBeNull();
    });
  });
});
