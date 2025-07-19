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
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('/whoami')
  // async whoAmI(@Session() session: any) {
  //   return await this.userService.findOne(session.userId);
  // }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  async whoAmI(@CurrentUser() user: Promise<User>) {
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: { userId?: number | null }): void {
    session.userId = null;
  }

  @Post('/signup')
  async createUser(
    @Body() body: CreateUserDto,
    @Session() session: { userId?: number | null },
  ): Promise<CreateUserDto> {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(
    @Body() body: CreateUserDto,
    @Session() session: { userId?: number | null },
  ): Promise<CreateUserDto> {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/:id')
  async findUserById(@Param() params: { id: number }): Promise<User | null> {
    const user = await this.userService.findOne(+params.id);
    if (!user) throw new NotFoundException('user not found');
    return user;
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
