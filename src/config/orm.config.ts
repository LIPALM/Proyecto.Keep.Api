import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Usuario } from "src/usuario/model/usuario.model";

export default registerAs(
    'orm.config',
    (): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: +(process.env.DB_PORT || 5432),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadEntities: true, // Carga automáticamente las entidades registradas en el módulo
        synchronize: true, // Solo para desarrollo, no usar en producción
        // dropSchema: true, // Solo para desarrollo, no usar en producción
        ssl: {
          rejectUnauthorized: false, // Permite conexiones SSL sin verificar el certificado (útil para desarrollo)
        }
    }),
);