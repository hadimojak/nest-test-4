import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { NotFoundException } from '@nestjs/common';
import { SessionData } from 'src/guards/auth.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: () => {
        return Promise.resolve([
          { id: 1, email: 'asdf@asdf.com', password: 'asdf' },
          { id: 2, email: 'qwer@qwe.com', password: 'qwer' },
        ]);
      },
      findOne: (id: number) =>
        Promise.resolve({ id, email: 'asdf@asdf.com', password: 'asdf' }),
      // remove: (id) => {},
      // update: (id, attrs) => {},
    };
    fakeAuthService = {
      // signup: (email, password) => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password });
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find all users with given email', async () => {
    const users = await controller.findUser({ email: 'asdf@asdf.com' });

    expect(users.length).toEqual(2);
    expect(users[0].email).toEqual('asdf@asdf.com');
  });

  it('find user by given id', async () => {
    const user = await controller.findUserById({ id: 1 });
    expect(user?.email).toEqual('asdf@asdf.com');
  });

  it('find user by given id not found', async () => {
    fakeUsersService.findOne = () => Promise.resolve(null);
    await expect(controller.findUserById({ id: 1 })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('signin process route update session object', async () => {
    const session: SessionData = {};
    const user = (await controller.signin(
      { email: 'aaaa@asd.com', password: 'asdqwe' },
      session,
    )) as User;

    expect(user.id).toEqual(1);
    expect(session.userId);
  });
});
