import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
    EMPLOYEE = "employee",
    HRADMIN = "hradmin"
}

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    employeeId: number

    @Column()
    email: string
    
    @Column({name: "password_hash"})
    passwordHash:string

    @Column({type: "simple-enum", enum: UserRole, default: UserRole.EMPLOYEE})
    role: UserRole
    
    @Column({name: "last_login_at", type: "datetime", nullable: true})
    lastLogin:Date | null
    
    @CreateDateColumn({name: "created_at"})
    createdAt:Date

    @UpdateDateColumn({name:"updated_at"})
    updatedAt:Date
}