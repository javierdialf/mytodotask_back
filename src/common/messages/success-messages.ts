const DEFAULT_IDENTIFICATOR_NAME: string = 'id';

export const SuccessMessage = {

    OBJECT_SUCCESS_ACCTION:(object: string, action: string, identicator?: string | number, identicatorName?: string) => 
        identicator 
        ? `${object} with ${identicatorName ?? DEFAULT_IDENTIFICATOR_NAME}: ${identicator} ${action} successfully`
        : `${object} ${action} successfully`   
}