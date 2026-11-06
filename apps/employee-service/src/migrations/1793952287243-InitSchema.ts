import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1793952287243 implements MigrationInterface {
    name = 'InitSchema1793952287243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`employee\` (\`id\` int NOT NULL AUTO_INCREMENT, \`full_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phoneNumber\` varchar(20) NULL, \`position\` varchar(255) NOT NULL, \`department\` varchar(255) NOT NULL, \`status\` enum ('active', 'inactive', 'pending') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, INDEX \`IDX_726b8b0208506f5378fc9b45c7\` (\`full_name\`), UNIQUE INDEX \`IDX_817d1d427138772d47eca04885\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_817d1d427138772d47eca04885\` ON \`employee\``);
        await queryRunner.query(`DROP INDEX \`IDX_726b8b0208506f5378fc9b45c7\` ON \`employee\``);
        await queryRunner.query(`DROP TABLE \`employee\``);
    }

}
