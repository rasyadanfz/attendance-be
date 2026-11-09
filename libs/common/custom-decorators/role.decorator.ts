import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../custom-guards/jwt.guard.js';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
