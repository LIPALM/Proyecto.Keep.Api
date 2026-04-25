import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './model/note.model';
import { NoteDto } from './dto/note.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly repository: Repository<Note>,
  ) {}

  async getAll() {
    return this.repository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  async getActive() {
    return this.repository.find({
      where: {
        activo: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async getById(id: number) {
    const note = await this.repository.findOneBy({ id });

    if (!note) {
      throw new NotFoundException(`Note con id ${id} no encontrada`);
    }

    return note;
  }

  async save(data: NoteDto) {
    if (data.id !== undefined && data.id !== null && data.id !== 0) {
      const note = await this.repository.findOneBy({ id: data.id });

      if (!note) {
        throw new NotFoundException(`Note con id ${data.id} no encontrada`);
      }

      note.title = data.title;
      note.content = data.content;
      note.activo = data.activo ?? note.activo;

      await this.repository.save(note);

      return {
        message: 'Note actualizada correctamente',
        id: note.id,
      };
    }

    const note = this.repository.create({
      title: data.title,
      content: data.content,
      activo: data.activo ?? true,
    });

    const savedNote = await this.repository.save(note);

    return {
      message: 'Note guardada correctamente',
      id: savedNote.id,
    };
  }

  async delete(id: number) {
    const note = await this.repository.findOneBy({ id });

    if (!note) {
      throw new NotFoundException(`Note con id ${id} no encontrada`);
    }

    await this.repository.delete({ id });

    return {
      message: 'Note eliminada correctamente',
    };
  }
}
