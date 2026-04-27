import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reminder } from './model/reminder.model';
import { ReminderDto } from './dto/reminder.dto';
import { Note } from 'src/note/model/note.model';

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(Reminder)
    private readonly reminderRepository: Repository<Reminder>,
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  async getAll() {
    return this.reminderRepository.find({
      relations: { note: true },
      select: {
        id: true,
        title: true,
        description: true,
        remind_at: true,
        is_completed: true,
        activo: true,
        created_at: true,
        updated_at: true,
        note: {
          id: true,
        },
      },
      order: {
        remind_at: 'ASC',
      },
    });
  }

  async getPending() {
    return this.reminderRepository.find({
      where: {
        is_completed: false,
        activo: true,
      },
      relations: { note: true },
      select: {
        id: true,
        title: true,
        description: true,
        remind_at: true,
        is_completed: true,
        activo: true,
        created_at: true,
        updated_at: true,
        note: {
          id: true,
        },
      },
      order: {
        remind_at: 'ASC',
      },
    });
  }

  async getById(id: number) {
    const reminder = await this.reminderRepository.findOne({
      where: { id },
      relations: { note: true },
      select: {
        id: true,
        title: true,
        description: true,
        remind_at: true,
        is_completed: true,
        activo: true,
        created_at: true,
        updated_at: true,
        note: {
          id: true,
        },
      },
    });

    if (!reminder) {
      throw new NotFoundException(`Reminder con id ${id} no encontrado`);
    }

    return reminder;
  }

  async getByNoteId(noteId: number) {
    await this.findNoteById(noteId);

    return this.reminderRepository.find({
      where: {
        note: {
          id: noteId,
        },
      },
      relations: {
        note: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        remind_at: true,
        is_completed: true,
        activo: true,
        created_at: true,
        updated_at: true,
        note: {
          id: true,
        },
      },
      order: {
        remind_at: 'ASC',
      },
    });
  }

  async save(data: ReminderDto) {
    const note = await this.findNoteById(data.noteId);
    const remindAtDate = this.validateAndParseDate(data.remind_at);

    if (data.id !== undefined && data.id !== null && data.id !== 0) {
      const reminder = await this.reminderRepository.findOneBy({ id: data.id });

      if (!reminder) {
        throw new NotFoundException(`Reminder con id ${data.id} no encontrado`);
      }

      reminder.title = data.title;
      reminder.description = data.description;
      reminder.remind_at = remindAtDate;
      reminder.is_completed = data.is_completed ?? reminder.is_completed;
      reminder.activo = data.activo ?? reminder.activo;
      reminder.note = note;

      await this.reminderRepository.save(reminder);

      return {
        message: 'Reminder actualizado correctamente',
        id: reminder.id,
      };
    }

    const reminder = this.reminderRepository.create({
      title: data.title,
      description: data.description,
      remind_at: remindAtDate,
      is_completed: data.is_completed ?? false,
      activo: data.activo ?? true,
      note,
    });

    const savedReminder = await this.reminderRepository.save(reminder);

    return {
      message: 'Reminder guardado correctamente',
      id: savedReminder.id,
    };
  }

  async delete(id: number) {
    const reminder = await this.reminderRepository.findOneBy({ id });

    if (!reminder) {
      throw new NotFoundException(`Reminder con id ${id} no encontrado`);
    }

    await this.reminderRepository.delete({ id });

    return {
      message: 'Reminder eliminado correctamente',
    };
  }

  private async findNoteById(id: number) {
    const note = await this.noteRepository.findOneBy({ id });

    if (!note) {
      throw new NotFoundException(`Note con id ${id} no encontrada`);
    }

    return note;
  }

  private validateAndParseDate(dateString: string) {
    const parsedDate = new Date(dateString);

    if (Number.isNaN(parsedDate.getTime())) {
      throw new BadRequestException('La fecha de remind_at no es valida');
    }

    return parsedDate;
  }
}
