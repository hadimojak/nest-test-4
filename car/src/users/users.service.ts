import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string): Promise<void> {
    const user = this.repo.create({ email, password });
    await this.repo.save(user);
    return;
  }

  async findOne(id: number): Promise<Pick<User, 'email' | 'id' | 'password'>> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async find(
    email: string,
  ): Promise<Pick<User, 'email' | 'id' | 'password'>[]> {
    const users = await this.repo.find({ where: { email: email } });
    return users;
  }

  async update(id: number, attrs: Partial<User>): Promise<void> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');
    Object.assign(user, attrs);
    await this.repo.save(user);
    return;
  }

  async remove(id: number): Promise<void> {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found');
    if (user) {
      await this.repo.remove(user);
    }
    return;
  }
}
