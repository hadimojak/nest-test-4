import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto): Promise<void> {
    await this.userService.create(body.email, body.password);
    return;
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
