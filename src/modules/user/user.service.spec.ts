import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from '../../dtos/user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create and return a new user with hashed password', async () => {
      const createUserDto: CreateUserDto = {
        username: 'john_doe',
        password: 'password123',
      };
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = {
        id: 1,
        username: createUserDto.username,
        password: hashedPassword,
      };

      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

      const result = await userService.createUser(createUserDto);

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const users = [
        { id: 1, username: 'john_doe', password: 'hashed_password' },
      ];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await userService.getUsers();

      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('getUserById', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, username: 'john_doe', password: 'hashed_password' };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await userService.getUserById(1);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.getUserById(1)).rejects.toThrow(
        new NotFoundException('User with ID 1 not found'),
      );
    });
  });

  describe('updateUser', () => {
    it('should update and return the updated user', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'updated_user',
        password: 'new_password',
      };
      const hashedPassword = updateUserDto.password
        ? await bcrypt.hash(updateUserDto.password, 10)
        : undefined;
      const updatedUser = {
        id: 1,
        username: updateUserDto.username,
        password: hashedPassword,
      };

      mockUserRepository.update.mockResolvedValue({ affected: 1 });
      mockUserRepository.findOne.mockResolvedValue(updatedUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

      const result = await userService.updateUser(1, updateUserDto);

      expect(mockUserRepository.update).toHaveBeenCalledWith(1, {
        ...updateUserDto,
        password: hashedPassword,
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.update.mockResolvedValue({ affected: 0 });

      await expect(
        userService.updateUser(1, { username: 'updated_user' }),
      ).rejects.toThrow(new NotFoundException('User with ID 1 not found'));
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(userService.deleteUser(1)).resolves.not.toThrow();

      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(userService.deleteUser(1)).rejects.toThrow(
        new NotFoundException('User with ID 1 not found'),
      );
    });
  });
});
