import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UsuarioController } from './usuario/usuario.controller';
import ormConfig from './config/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario/model/usuario.model';
import { ConfigModule } from '@nestjs/config';
import { UsuarioService } from './usuario/usuario.service';
import { JwtModule } from '@nestjs/jwt';
import { AttachmentController } from './attachment/attachment.controller';
import { AttachmentService } from './attachment/attachment.service';
import { Attachment } from './attachment/model/attachment.model';
import { Note } from './note/model/note.model';
import { NoteController } from './note/note.controller';
import { NoteService } from './note/note.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
    }),

    TypeOrmModule.forRootAsync({
      useFactory: ormConfig,
    }),

    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DB_HOST,
    //   port: +(process.env.DB_PORT || 5432),
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_NAME,
    //   autoLoadEntities: true, // Carga automáticamente las entidades registradas en el módulo
    //   synchronize: true, // Solo para desarrollo, no usar en producción
    //   dropSchema: true, // Solo para desarrollo, no usar en producción
    //   ssl: {
    //     rejectUnauthorized: false, // Permite conexiones SSL sin verificar el certificado (útil para desarrollo)
    //   }
    // }),
    JwtModule.register({
      global: true,

      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8h' },
    }),
    TypeOrmModule.forFeature([Usuario, Attachment, Note]),
  ],
  controllers: [
    AppController,
    UsuarioController,
    AttachmentController,
    NoteController,
  ],
  providers: [
    UsuarioService,
    AttachmentService,
    NoteService,
  ],
})
export class AppModule {}