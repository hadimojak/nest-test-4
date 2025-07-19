import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email: 'asdf@asdf.com', password: 'asdf' },
        ]);
      },
      findOne: (id) =>
        Promise.resolve({ id, email: 'asdf@asdf.com', password: 'asdf' }),
      // remove: (id) => {},
      // update: (id, attrs) => {},
    };
    fakeAuthService = {
      // signup: (email, password) => {},
      // signin: (email, password) => {},
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
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  });
});
