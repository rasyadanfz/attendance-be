import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1793935840219 implements MigrationInterface {
    name = 'InitSchema1793935840219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`account\` (\`id\` int NOT NULL AUTO_INCREMENT, \`employeeId\` int NOT NULL, \`email\` varchar(255) NOT NULL, \`passwordHash\` varchar(255) NOT NULL, \`lastLogin\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`account\``);
    }

}
