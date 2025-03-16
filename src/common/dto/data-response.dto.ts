export type metadataType = {
    totalPages: number;
    currentPage: number;
    limit: number;
}


export type dataType<T> = {
    content: T | T[]
    metadata?: metadataType
}


export class DataResponseDto<T>{
    data: dataType<T>;
    message?: string
}
