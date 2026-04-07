import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Usuario } from "./model/usuario.model";
import { InjectRepository } from "@nestjs/typeorm";
import { UsuarioDto } from "./dto/usuario.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";

// import { bcrypt } from 'bcrypt';
const bcrypt = require('bcrypt');

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private readonly repository: Repository<Usuario>,
        private readonly jwtService: JwtService
    ) {}

    getAll() {
        return this.repository.find({
            select: ['id', 'name', 'email', 'created_at', 'updated_at'] // Excluye el campo password
        });
    }

    getById(id: number) {
        // var data = this.repository.findOneBy({id: id}); // Recupera todos los campos, incluyendo password
        var data = this.repository.findOne({
            where: { id },
            select: ['id', 'name', 'email', 'created_at', 'updated_at'] // Excluye el campo password
        });
        return data;
    }

    async save(data: UsuarioDto) {
        if(data.id != undefined && data.id != null && data.id != 0) {
            const usuario = await this.repository.findOneBy({id: data.id});
            if(!usuario) throw new Error(`Usuario con id ${data.id} no encontrado`);

            if(data.password) {
                data.password = await this.createHashedPassword(data.password);
            }

            await this.repository.update({id: data.id}, data);
            return 'Se actualizo correctamente!!!';
        } else {
            const email = await this.repository.findOne({ where: { email: data.email } });
            if(email) throw new Error(`El email ${data.email} ya está registrado`);

            const hashedPassword = await this.createHashedPassword(data.password);
            data.password = hashedPassword;

            await this.repository.save(data);
            return 'Se guardo correctamente!!!';
        }
    }

    async delete(id: number) {
        var data = await this.findById(id); // Verifica si el usuario existe antes de eliminarlo
        if (!data) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
        await this.repository.delete({id});
        return 'Se elimino correctamente!!!';
    }

    async findById(id: number) {
        const usuario = await this.repository.findOne({
            where: { id },
            select: ['id', 'name', 'email', 'created_at', 'updated_at'] // Excluye el campo password
        });

        if(!usuario) throw new NotFoundException(`Usuario con id ${id} no encontrado`);

        return usuario;
    }

    async generateJWT(data: UsuarioDto) {
        return await this.createHashedPassword(data.password);
    }

    // Metodo para crear una contraseña hasheada
    async createHashedPassword(password: string): Promise<string> {
        var SALT_ROUNDS = 12;
        return await bcrypt.hashSync(password, SALT_ROUNDS);
    }
    // Método para verificar la contraseña
    async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compareSync(plainPassword, hashedPassword);
    }

    async login(data: LoginDto) {
        // 1. Buscar usuario por email (con password esta vez)
        const usuario = await this.repository.findOne({
            where: { email: data.email },
            select: ['id', 'name', 'email', 'password']
        });

        // 2. Si no existe el usuario
        if (!usuario) throw new UnauthorizedException('Credenciales incorrectas');

        // 3. Verificar la contraseña
        const passwordValido = await bcrypt.compareSync(data.password, usuario.password);
        if (!passwordValido) throw new UnauthorizedException('Credenciales incorrectas');

        // 4. Generar el JWT
        const payload = { 
            sub: usuario.id,      // id del usuario
            email: usuario.email,
            name: usuario.name 
        };

        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }
}