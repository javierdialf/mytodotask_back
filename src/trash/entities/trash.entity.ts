import { BaseModel } from "../../common/abstract_models/baseModel";
import { Entity, Column} from "typeorm";

@Entity('trash')
export class Trash extends BaseModel{

    @Column({length: 4000, nullable: true, name: 'contenido'})
    contenido?: string;

    @Column({nullable: true, name: 'fecha_recordatorio'})
    fechaRecordatorio?: Date;

    @Column({default: false, nullable: true})
    notificado?: boolean;

    @Column({default: true, nullable: true})
    estado?: boolean;

    @Column({default: false, nullable: true})
    fijado?: boolean;

    @Column({name: 'user_id'})
    userId: string;

    @Column({type: "varchar", length: 9, nullable: true})
    tipo: string;
}
