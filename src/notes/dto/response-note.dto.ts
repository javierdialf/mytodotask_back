export class ResponseNoteDto {  
    id: string;
    
    titulo: string;
            
    createAt: Date;
    
    updateAt: Date;

    contenido: string;

    fijado?: boolean;
        
    userId: string
}