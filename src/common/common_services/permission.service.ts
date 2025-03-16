import { ConflictException, Injectable } from "@nestjs/common";

@Injectable()
export class PermissionService {
    public verifyUser(currentUserId: string, reminderUserId: string) {
        if (currentUserId != reminderUserId) throw new ConflictException('Access denied for this action');
    }
}