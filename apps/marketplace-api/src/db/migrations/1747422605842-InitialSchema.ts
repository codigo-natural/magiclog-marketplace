// apps/marketplace-api/src/db/migrations/InitialSchema1747422605842.ts
import { MigrationInterface, QueryRunner } from "typeorm";

// Asegúrate que estos valores coincidan con tu enum UserRole en el código
const userRoleValues = ["admin", "seller"];

export class InitialSchema1747422605842 implements MigrationInterface {
    name = 'InitialSchema1747422605842';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Crear el tipo ENUM para 'role' PRIMERO
        await queryRunner.query(
            `CREATE TYPE "public"."users_role_enum" AS ENUM(${userRoleValues.map(role => `'${role}'`).join(', ')})`
        );

        // 2. Crear la tabla "users" (que usa el enum)
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "passwordHash" character varying NOT NULL,
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'seller',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
            )
        `);

        // 3. Crear la tabla "products"
        await queryRunner.query(`
            CREATE TABLE "products" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "sku" character varying NOT NULL,
                "quantity" integer NOT NULL,
                "price" numeric(10,2) NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "sellerId" uuid NOT NULL,
                CONSTRAINT "UQ_products_sku" UNIQUE ("sku"),
                CONSTRAINT "PK_products_id" PRIMARY KEY ("id")
            )
        `);

        // 4. Añadir la clave foránea a "products" que referencia a "users"
        await queryRunner.query(`
            ALTER TABLE "products" 
            ADD CONSTRAINT "FK_products_seller" FOREIGN KEY ("sellerId") 
            REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_products_seller"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }
}