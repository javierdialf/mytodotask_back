export class ResponseReminderDto {
    id: string;

    titulo: string;

    createAt: Date;

    updateAt: Date;

    contenido?: string;

    fechaRecordatorio: Date;

    notificado?: boolean;
    
    estado?: boolean;

    fijado?: boolean;
    
    userId: string
}