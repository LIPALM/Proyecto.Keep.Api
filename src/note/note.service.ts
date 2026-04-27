import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { Note } from './model/note.model';
import { NoteDto } from './dto/note.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly repository: Repository<Note>,
  ) {}

  // Solo notas NO eliminadas del usuario
  async getAll(usuarioId: number) {
    return this.repository.find({
      where: { 
        usuario: { id: usuarioId },
        deleted_at: IsNull() 
      },
      order: { id: 'DESC' },
    });
  }

  // Solo notas NO eliminadas del usuario
  async getByUsuarioId(usuarioId: number) {
    return this.repository.find({
      where: { 
        usuario: { id: usuarioId },
        deleted_at: IsNull()
      },
      order: { id: 'DESC' },
    });
  }

  async getActive(usuarioId: number) {
    return this.repository.find({
      where: {
        usuario: { id: usuarioId },
        activo: true,
        deleted_at: IsNull()
      },
      order: { id: 'DESC' },
    });
  }

  async getById(id: number) {
    const note = await this.repository.findOne({
      where: { 
        id,
        deleted_at: IsNull()
      },
    });

    if (!note) {
      throw new NotFoundException(`Note con id ${id} no encontrada`);
    }

    return note;
  }

  async save(data: NoteDto, usuarioId: number) {
    if (!data.title || !data.content) {
      throw new BadRequestException('Title y content son requeridos');
    }

    if (data.id) {
      const note = await this.repository.findOne({
        where: { 
          id: data.id, 
          usuario: { id: usuarioId },
          deleted_at: IsNull()
        },
      });

      if (!note) {
        throw new NotFoundException(`Note con id ${data.id} no encontrada`);
      }

      note.title = data.title;
      note.content = data.content;
      note.activo = data.activo ?? note.activo;

      const updated = await this.repository.save(note);
      return { 
        message: 'Note actualizada correctamente', 
        id: updated.id,
        data: updated
      };
    }

    const newNote = this.repository.create({
      title: data.title,
      content: data.content,
      activo: data.activo ?? true,
      usuario: { id: usuarioId },
    });

    const saved = await this.repository.save(newNote);
    return { 
      message: 'Note guardada correctamente', 
      id: saved.id,
      data: saved
    };
  }

  // 🗑️ Enviar a papelera (soft delete)
  async delete(id: number, usuarioId: number) {
    const note = await this.repository.findOne({
      where: { 
        id, 
        usuario: { id: usuarioId },
        deleted_at: IsNull()
      },
    });

    if (!note) {
      throw new NotFoundException(`Note con id ${id} no encontrada`);
    }

    note.deleted_at = new Date();
    note.activo = false;
    await this.repository.save(note);

    return {
      message: 'Note enviada a papelera',
    };
  }

  // 📋 Obtener papelera del usuario
  async getTrash(usuarioId: number) {
    return this.repository.find({
      where: {
        usuario: { id: usuarioId },
        deleted_at: Not(IsNull())
      },
      order: { deleted_at: 'DESC' },
    });
  }

  // ↩️ Restaurar nota desde papelera
  async restore(id: number, usuarioId: number) {
    const note = await this.repository.findOne({
      where: {
        id,
        usuario: { id: usuarioId },
        deleted_at: Not(IsNull())
      },
    });

    if (!note) {
      throw new NotFoundException(`Note en papelera con id ${id} no encontrada`);
    }

    note.deleted_at = null as any;
    note.activo = true;
    await this.repository.save(note);

    return {
      message: 'Note restaurada correctamente',
      id: note.id,
      data: note
    };
  }

  // 🔴 Eliminar permanentemente de papelera
  async permanentDelete(id: number, usuarioId: number) {
    const note = await this.repository.findOne({
      where: {
        id,
        usuario: { id: usuarioId },
        deleted_at: Not(IsNull())
      },
    });

    if (!note) {
      throw new NotFoundException(`Note en papelera con id ${id} no encontrada`);
    }

    await this.repository.delete({ id });

    return {
      message: 'Note eliminada permanentemente',
    };
  }
}