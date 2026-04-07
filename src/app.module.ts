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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig
    }),
    JwtModule.register({
      global: true,               // disponible en toda la app
      secret: 'vWao0YN55tVgehJHqdqHy8f4fq0qrZaURbmrArAORGkizcw2ceUs7wat3uFPl2TEruW7ON8L3DNn6FTgxa4Fwy', // cambiá esto por algo seguro
      signOptions: { expiresIn: '8h' },
    }),
    TypeOrmModule.forFeature([Usuario])
  ],
  controllers: [
    AppController,
    UsuarioController,
  ],
  providers: [
    UsuarioService
  ],
})
export class AppModule {}