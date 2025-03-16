import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('reset_tokens')
export class ResetToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar'})
    token: string;

    @Column({type: 'varchar'})
    email: string

    @Column()
    createdAt: Date;

    @Column()
    expiresIn: Date;
}