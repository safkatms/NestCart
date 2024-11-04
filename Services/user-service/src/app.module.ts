import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm.config';
import { UsersModule } from './users/users.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig),UsersModule,AuthModule, AddressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
