import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    await this.userService.create(body.email, body.password);
  }
}
