// src/entities/payment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column()
    currency: string;

    @Column({ default: 'pending' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}