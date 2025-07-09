import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  Session,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  async whoAmI(@Session() session: any) {
    return this.userService.findOne(session.userId);
  }

  @Post('/signup')
  async createUser(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<CreateUserDto> {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<CreateUserDto> {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/:id')
  async findUserById(
    @Param() params: { id: number },
  ): Promise<Pick<User, 'email' | 'id' | 'password'>> {
    return await this.userService.findOne(+params.id);
  }

  @Get('/')
  async findUser(
    @Query() query: { email: string },
  ): Promise<Pick<User, 'email' | 'id' | 'password'>[]> {
    const users = await this.userService.find(query.email);
    return users;
  }

  @Patch('/:id')
  async updateUser(
    @Param() params: { id: number },
    @Body() body: UpdateUserDto,
  ): Promise<void> {
    return await this.userService.update(+params.id, body);
  }

  @Delete('/:id')
  async deleteUser(@Param() params: { id: number }): Promise<void> {
    await this.userService.remove(+params.id);
    return;
  }
}
