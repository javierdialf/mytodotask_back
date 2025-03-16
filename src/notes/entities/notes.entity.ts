import { BaseModel } from "../../common/abstract_models/baseModel";
import { Column, ManyToOne,  Entity, JoinColumn} from "typeorm";
import { User } from "../../users/entities/users.entity";

@Entity('notes')
export class Note extends BaseModel
{
        @Column({length: 4000, nullable: true})
        contenido: string;

        @Column({default: false, nullable: true})
        fijado?: boolean;
        
        @ManyToOne(() => User, (user) => user.notes, {nullable: false, onDelete: 'CASCADE'})
        @JoinColumn({name: 'user_id'})
        user: User;
    }
