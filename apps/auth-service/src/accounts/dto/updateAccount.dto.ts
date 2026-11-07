import { IsNotEmpty, IsOptional } from "class-validator";
import { Expose } from "class-transformer"

export class UpdateAccountDTO {
    @IsOptional()
    email: string

    @Expose({name: "is_active"})
    @IsOptional()
    isActive: boolean
}