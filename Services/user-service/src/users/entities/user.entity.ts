import { Address } from 'src/address/entities/address.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];
}
