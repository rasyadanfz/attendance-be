import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

export type UserRoles = 'employee' | 'hradmin'

export type JwtUserData = {
    sub: number
    role: UserRoles
    employee_id?: number
}

export interface AuthenticatedRequest extends Request {
    user: JwtUserData
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwt: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<AuthenticatedRequest>()
        const authHeader = req.headers["authorization"]

        if (!authHeader || typeof authHeader !== "string") throw new UnauthorizedException()

        const [type, token] = authHeader.split(" ")
        if (type !== "Bearer" || !token) throw new UnauthorizedException()

        try {
            req.user = await this.jwt.verifyAsync<JwtUserData>(token)
        } catch (e) {
            throw new UnauthorizedException()
        }

        return true
    }

}