// src/users/entities/user.entity.ts
import { Address } from 'src/address/entities/address.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

export enum UserType {
  ADMIN = 'admin',
  CUSTOMER = 'customer'
}


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  googleId: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.CUSTOMER, // Default user type
  })
  userType: UserType;

  @Column({ default: false })
  banned: boolean;
  
  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];
}
