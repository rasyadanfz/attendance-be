import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum EmployeeStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending"
}

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number

    @Column({name: "full_name"})
    @Index()
    fullName: string

    @Column({unique: true})
    email: string

    @Column({length: 20, nullable: true})
    phoneNumber: string

    @Column()
    position: string

    @Column()
    department: string

    @Column({type: "enum", enum: EmployeeStatus})
    status: EmployeeStatus

    @CreateDateColumn({name:"created_at"})
    createdAt: Date

    @UpdateDateColumn({name:"updated_at"})
    updatedAt: Date

    @DeleteDateColumn({name:"deleted_at"})
    deletedAt: Date
}