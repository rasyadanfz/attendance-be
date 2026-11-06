import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1793956770809 implements MigrationInterface {
    name = 'InitSchema1793956770809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`account\` (\`id\` int NOT NULL AUTO_INCREMENT, \`employee_id\` int NOT NULL, \`email\` varchar(255) NOT NULL, \`password_hash\` varchar(255) NOT NULL, \`role\` enum ('employee', 'hradmin') NOT NULL DEFAULT 'employee', \`last_login_at\` datetime NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_ec3333e4b260158769c1164c66\` (\`employee_id\`), UNIQUE INDEX \`IDX_4c8f96ccf523e9a3faefd5bdd4\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_4c8f96ccf523e9a3faefd5bdd4\` ON \`account\``);
        await queryRunner.query(`DROP INDEX \`IDX_ec3333e4b260158769c1164c66\` ON \`account\``);
        await queryRunner.query(`DROP TABLE \`account\``);
    }

}
