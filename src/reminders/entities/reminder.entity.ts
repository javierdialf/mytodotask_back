import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { User } from "../../users/entities/users.entity";
import { BaseModel } from "../../common/abstract_models/baseModel";

@Entity('reminders')
export class Reminder extends BaseModel{
    
    @Column({length: 4000, nullable: true})
    contenido?: string;

    @Column({nullable: false, name: 'fecha_recordatorio'})
    fechaRecordatorio: Date;

    @Column({default: false})
    notificado?: boolean;

    @Column({default: true})
    estado?: boolean;

    @Column({default: false})
    fijado?: boolean;

    @ManyToOne(() => User, (user) => user.reminders, {nullable: false, onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user: User
}
