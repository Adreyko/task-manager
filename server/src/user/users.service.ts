import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { User } from './enteties/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async findOneBy(field: {
    username?: string;
    email?: string;
    id?: number;
  }): Promise<User | undefined> {
    const users = await this.userRepository.findOne({ where: field });

    return users;
  }
}
