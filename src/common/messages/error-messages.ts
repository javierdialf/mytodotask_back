const DEFAULT_IDENTIFICATOR_NAME: string = 'id';

export const ErrorMessage = {
    
    OBJECT_NOT_FOUND: (object: string, identicator?: string | number, identicatorName?: string) => 
        identicator 
        ? `${object} with ${identicatorName ?? DEFAULT_IDENTIFICATOR_NAME}: ${identicator} not found` 
        : `${object} not found`,


    DATA_NOT_EMPTY: 'the data cannot be empty',

    OPERATION_FAILED_ERROR:(message?: string) => message
    ? message
    : 'An error occurred while executing the action, and it could not be completed successfully',
    

    ONLY_INSTITUTIONAL_EMAILS: 'only institutional emails',
    WRONG_CREDENTIALS: 'wrong credentials'
}