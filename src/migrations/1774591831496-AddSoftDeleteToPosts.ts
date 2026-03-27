import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoftDeleteToPosts1774591831496 implements MigrationInterface {
    name = 'AddSoftDeleteToPosts1774591831496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "deletedAt"`);
    }

}
