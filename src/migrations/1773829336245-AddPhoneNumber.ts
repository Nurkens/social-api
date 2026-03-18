import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneNumber1773829336245 implements MigrationInterface {
    name = 'AddPhoneNumber1773829336245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "phoneNumber" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phoneNumber"`);
    }

}
