import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { randomBytes, scrypt as __scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(__scrypt);

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //crea te fake copy of usersService
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password }),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create instance of auth service', () => {
    expect(service).toBeDefined();
  });

  it('create new user and salt and hash password', async () => {
    const user = await service.signup('hadi@gmailc.vom', 'qwert12345');

    expect(user.password).not.toEqual('qwert12345');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if duplicate email ecuured in signup flow', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'hh6777@gmail.com', password: 'aasd' }]);

    await expect(
      service.signup('hh6777@gmail.com', 'qwe123'),
    ).rejects.toThrow();
  });

  it('thorws an error if signin call with unused email', async () => {
    fakeUsersService.find = () => Promise.resolve([]);

    await expect(
      service.signin('hh6777@gmail.com', 'qwe123'),
    ).rejects.toThrow();
  });

  it('thorws an erro if password was incurrect', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'hh6777@gmail.com',
          password: 'qwer1234',
        },
      ]);

    await expect(
      service.signin('hh6777@gmail.com', 'qewr14'),
    ).rejects.toThrow();
  });

  it('user signin succesfuly with email and pass', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'hadi@gmail.com',
          password:
            '0f27893ce03d5599.5fd0cc9fdc807a5fb5aa7207a12971259f17fd64b5bfba328b0903b067312bb0',
        },
      ]);

    const user = await service.signin('hadi@gmail.com', 'qwer1234');

    expect(user.password).toEqual(
      '0f27893ce03d5599.5fd0cc9fdc807a5fb5aa7207a12971259f17fd64b5bfba328b0903b067312bb0',
    );
    const [salt, storedHash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(storedHash).toBeDefined();
    const hash = (await scrypt('qwer1234', salt, 32)) as Buffer;
    expect(storedHash).toEqual(hash.toString('hex'));
  });
});
