import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles, ROLES_KEY } from "../custom-decorators/role.decorator.js";
import { AuthenticatedRequest, UserRoles } from "./jwt.guard.js";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.getAllAndOverride<UserRoles[] | undefined>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])
        
        if (!roles || roles.length === 0) return true
        
        const { user, url, originalUrl } = context.switchToHttp().getRequest<AuthenticatedRequest>();
        if (!user || !roles.includes(user.role)) throw new ForbiddenException("you don't have permission to access this resource")

        return true
    }
}