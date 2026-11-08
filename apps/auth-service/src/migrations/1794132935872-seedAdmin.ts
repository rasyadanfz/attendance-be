import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedAdmin1794132935872 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO account(employee_id, email, password_hash, role, is_active)
             VALUES(NULL, 'hr_admin@company.com', '$2a$12$Dd/GdFRBRC5aJNc2i9uYJuHoVlSr3RkcvBX.herddFKzBd3NdzvMS', 'hradmin', true);
            `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM account WHERE email = 'hr_admin@company.com';`
        )
    }

}
