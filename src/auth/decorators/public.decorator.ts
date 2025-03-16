import { SetMetadata } from "@nestjs/common";

const public_key = 'IsPublic';
export const IsPublic = () => SetMetadata(public_key, true);