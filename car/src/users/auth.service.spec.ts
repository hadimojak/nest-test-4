import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //crea te fake copy of usersService
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        if (users.length === 0) return Promise.resolve([]);
        else {
          const filteredUsers = users.filter((user) => user.email === email);
          return Promise.resolve(filteredUsers);
        }
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.random() * 999999,
          email,
          password,
        };
        users.push(user);
        return Promise.resolve(user);
      },
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
    await service.signup('hh6777@gmail.com', 'qwe123');

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
    await service.signup('hadi@ggg.com', 'asd123');

    await expect(service.signin('hadi@ggg.com', 'asd1238')).rejects.toThrow();
  });

  it('user signin succesfuly with email and pass', async () => {
    await service.signup('asdasdas@asdf.asd', 'qwe123');

    const user = await service.signin('asdasdas@asdf.asd', 'qwe123');
    expect(user).toBeDefined();
  });
});
