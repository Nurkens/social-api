import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1773828546951 implements MigrationInterface {
    name = 'InitialSchema1773828546951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "postId" integer, "authorId" integer, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "image" character varying, "authorId" integer, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "username" character varying NOT NULL, "bio" character varying, "avatar" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts_likes_user" ("postsId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_edf477240f89444e1e582f46217" PRIMARY KEY ("postsId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8622c2a6c4c5f68ffce77fc75a" ON "posts_likes_user" ("postsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4cf6b5fa0b94692eb492b873d6" ON "posts_likes_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "user_following_user" ("userId_1" integer NOT NULL, "userId_2" integer NOT NULL, CONSTRAINT "PK_2c183a6c043a59133b516d5daa9" PRIMARY KEY ("userId_1", "userId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9691163a986dfb589a90dea3d5" ON "user_following_user" ("userId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_a89f5a432c1edcd03a3b655532" ON "user_following_user" ("userId_2") `);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4548cc4a409b8651ec75f70e280" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts_likes_user" ADD CONSTRAINT "FK_8622c2a6c4c5f68ffce77fc75a0" FOREIGN KEY ("postsId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "posts_likes_user" ADD CONSTRAINT "FK_4cf6b5fa0b94692eb492b873d6a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_following_user" ADD CONSTRAINT "FK_9691163a986dfb589a90dea3d5f" FOREIGN KEY ("userId_1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_following_user" ADD CONSTRAINT "FK_a89f5a432c1edcd03a3b6555321" FOREIGN KEY ("userId_2") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_following_user" DROP CONSTRAINT "FK_a89f5a432c1edcd03a3b6555321"`);
        await queryRunner.query(`ALTER TABLE "user_following_user" DROP CONSTRAINT "FK_9691163a986dfb589a90dea3d5f"`);
        await queryRunner.query(`ALTER TABLE "posts_likes_user" DROP CONSTRAINT "FK_4cf6b5fa0b94692eb492b873d6a"`);
        await queryRunner.query(`ALTER TABLE "posts_likes_user" DROP CONSTRAINT "FK_8622c2a6c4c5f68ffce77fc75a0"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4548cc4a409b8651ec75f70e280"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a89f5a432c1edcd03a3b655532"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9691163a986dfb589a90dea3d5"`);
        await queryRunner.query(`DROP TABLE "user_following_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4cf6b5fa0b94692eb492b873d6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8622c2a6c4c5f68ffce77fc75a"`);
        await queryRunner.query(`DROP TABLE "posts_likes_user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "comments"`);
    }

}
