// src/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    phone: string;

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'boolean', default: false })
    isActive: boolean;

    @Column({ type: 'boolean', default: false })
    isLocked: boolean;

    @Column({ type: 'timestamp', nullable: true })
    lockoutExpiry: Date | null;

    @Column({ type: 'int', default: 0 })
    failedLoginAttempts: number;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}