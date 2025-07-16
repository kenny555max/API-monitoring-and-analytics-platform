import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1748404200190 implements MigrationInterface {
    name = 'AutoMigration1748404200190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`username\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phone\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`isActive\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`isLocked\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lockoutExpiry\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`failedLoginAttempts\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`deletedAt\` timestamp NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`failedLoginAttempts\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lockoutExpiry\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`isLocked\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`isActive\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phone\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`username\``);
    }

}
