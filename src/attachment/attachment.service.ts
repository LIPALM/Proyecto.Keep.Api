import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './model/attachment.model';
import { Note } from 'src/note/model/note.model';
import { AttachmentDto } from './dto/attachment.dto';

export interface UploadedAttachmentFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class AttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  async getAll() {
    return this.attachmentRepository.find({
      relations: { note: true },
      select: {
        id: true,
        filename: true,
        filetype: true,
        filesize: true,
        note: {
          id: true,
        },
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async getById(id: number) {
    const attachment = await this.attachmentRepository.findOne({
      where: { id },
      relations: { note: true },
      select: {
        id: true,
        filename: true,
        filetype: true,
        filesize: true,
        note: {
          id: true,
        },
      },
    });

    if (!attachment) {
      throw new NotFoundException(`Attachment con id ${id} no encontrado`);
    }

    return attachment;
  }

  async getByNoteId(noteId: number) {
    await this.findNoteById(noteId);

    return this.attachmentRepository.find({
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
        filename: true,
        filetype: true,
        filesize: true,
        note: {
          id: true,
        },
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async save(data: AttachmentDto) {
    const note = await this.findNoteById(data.noteId);
    const filedata = this.base64ToBuffer(data.filedata);

    if (data.id !== undefined && data.id !== null && data.id !== 0) {
      const attachment = await this.attachmentRepository.findOneBy({ id: data.id });
      if (!attachment) {
        throw new NotFoundException(`Attachment con id ${data.id} no encontrado`);
      }

      attachment.filename = data.filename;
      attachment.filetype = data.filetype;
      attachment.filesize = data.filesize ?? filedata.length;
      attachment.filedata = filedata;
      attachment.note = note;

      await this.attachmentRepository.save(attachment);
      return {
        message: 'Attachment actualizado correctamente',
        id: attachment.id,
      };
    }

    const attachment = this.attachmentRepository.create({
      filename: data.filename,
      filetype: data.filetype,
      filesize: data.filesize ?? filedata.length,
      filedata,
      note,
    });

    const savedAttachment = await this.attachmentRepository.save(attachment);

    return {
      message: 'Attachment guardado correctamente',
      id: savedAttachment.id,
    };
  }

  async upload(noteId: number, file: UploadedAttachmentFile) {
    if (!file) {
      throw new BadRequestException('Debe enviar un archivo en el campo file');
    }

    const note = await this.findNoteById(noteId);

    const attachment = this.attachmentRepository.create({
      filename: file.originalname,
      filetype: file.mimetype,
      filesize: file.size,
      filedata: file.buffer,
      note,
    });

    const savedAttachment = await this.attachmentRepository.save(attachment);

    return {
      message: 'Attachment subido correctamente',
      id: savedAttachment.id,
    };
  }

  async getFileById(id: number) {
    const attachment = await this.attachmentRepository.findOneBy({ id });

    if (!attachment) {
      throw new NotFoundException(`Attachment con id ${id} no encontrado`);
    }

    return attachment;
  }

  async delete(id: number) {
    const attachment = await this.attachmentRepository.findOneBy({ id });

    if (!attachment) {
      throw new NotFoundException(`Attachment con id ${id} no encontrado`);
    }

    await this.attachmentRepository.delete({ id });

    return {
      message: 'Attachment eliminado correctamente',
    };
  }

  private async findNoteById(id: number) {
    const note = await this.noteRepository.findOneBy({ id });

    if (!note) {
      throw new NotFoundException(`Note con id ${id} no encontrada`);
    }

    return note;
  }

  private base64ToBuffer(fileDataBase64: string) {
    const cleanedBase64 = fileDataBase64.includes(',')
      ? fileDataBase64.split(',')[1]
      : fileDataBase64;

    const buffer = Buffer.from(cleanedBase64, 'base64');

    if (!buffer.length) {
      throw new BadRequestException('No fue posible convertir filedata desde base64');
    }

    return buffer;
  }
}
