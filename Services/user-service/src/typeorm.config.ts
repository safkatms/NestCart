// src/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import * as dotenv from 'dotenv';
import { PasswordReset } from './auth/entities/passwordReset.entity';
import { Address } from './address/entities/address.entity';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'nestcart_users',
  entities: [User,PasswordReset,Address],
  synchronize: true, // Set to false in production
};
