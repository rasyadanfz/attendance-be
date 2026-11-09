import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1794130510632 implements MigrationInterface {
  name = 'InitSchema1794130510632';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`attendance\` (\`id\` int NOT NULL AUTO_INCREMENT, \`employee_id\` int NOT NULL, \`date\` date NOT NULL, \`action\` enum ('check_in', 'check_out') NOT NULL, \`occured_at\` datetime NOT NULL, \`photo_filename\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_ff05fd5159e6d9d99514d46531\` (\`date\`), UNIQUE INDEX \`IDX_c4ac18c052dd25f4b42a9b8d58\` (\`employee_id\`, \`date\`, \`action\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_c4ac18c052dd25f4b42a9b8d58\` ON \`attendance\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_ff05fd5159e6d9d99514d46531\` ON \`attendance\``,
    );
    await queryRunner.query(`DROP TABLE \`attendance\``);
  }
}
