// src/address/entities/address.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { City } from '../dto/create-address.dto';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.addresses, { eager: false, onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'enum', enum: City })
  city: City;

  @Column()
  addressLine: string;

  @Column({ nullable: true })
  landmark?: string;

  @Column()
  recipientName: string;

  @Column({ length: 11 })
  phoneNumber: string;
}
