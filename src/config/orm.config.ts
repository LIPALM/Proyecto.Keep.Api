import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Usuario } from "src/usuario/model/usuario.model";

export default registerAs(
    'orm.config',
    (): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: '127.0.0.1',
        port: 5432,
        username: 'sa',
        password: '1844',
        database: 'googlekeep-db',
        entities: [Usuario],
        synchronize: true,
    }),
);