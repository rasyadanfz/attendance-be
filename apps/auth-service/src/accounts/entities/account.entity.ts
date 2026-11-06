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
    
    @Column()
    passwordHash:string

    @Column({type: "simple-enum", enum: UserRole, default: UserRole.EMPLOYEE})
    role: UserRole
    
    @Column({nullable: true})
    lastLogin:Date
    
    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    updatedAt:Date
}