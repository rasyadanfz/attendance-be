import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
    
    @Column({nullable: true})
    lastLogin:Date
    
    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    updatedAt:Date
}