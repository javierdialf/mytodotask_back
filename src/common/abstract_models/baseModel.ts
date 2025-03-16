import { UpdateDateColumn, Column, PrimaryGeneratedColumn, CreateDateColumn, Entity, TableInheritance } from "typeorm";

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