import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('password_resets')
export class PasswordReset {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    resetToken: string;

    @Column({ default: false })
    isUsed: boolean; // Indicates whether the token has been used

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    expiresAt: Date; // Time when the reset token expires

    @UpdateDateColumn()
    updatedAt: Date;
}
