import { Note } from "../../notes/entities/notes.entity";
import { Reminder } from "../../reminders/entities/reminder.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length:25})
    name: string;

    @Column({length:25})
    lastName: string;

    @Column({unique:true})
    email: string;

    @Column({length: 250, nullable: true})
    photo: string;

    @Column()
    password: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Note, (note) => note.user)
    notes: Note[];

    @OneToMany(() => Reminder, (reminder) => reminder.user)
    reminders: Reminder[];
}