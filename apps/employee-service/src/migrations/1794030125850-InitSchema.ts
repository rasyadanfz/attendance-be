import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1794030125850 implements MigrationInterface {
    name = 'InitSchema1794030125850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD \`deleted_at\` datetime(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

}
