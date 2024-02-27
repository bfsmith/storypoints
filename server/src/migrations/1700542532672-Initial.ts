import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1700542532672 implements MigrationInterface {
  name = 'Initial1700542532672';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "room" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "pointOptions" text NOT NULL,
        "members" text NOT NULL,
        "title" varchar NOT NULL,
        "description" varchar NOT NULL,
        "votes" text NOT NULL,
        "areVotesVisible" boolean NOT NULL
      );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "room"`);
  }
}
