import { UpdateDateColumn, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

export abstract class BaseModel{
    @PrimaryGeneratedColumn('uuid')
        id: string;

        @Column({length: 35, nullable: false})
        titulo: string;
        
        @CreateDateColumn()
        createAt: Date;

        @UpdateDateColumn()
        updateAt: Date;
}