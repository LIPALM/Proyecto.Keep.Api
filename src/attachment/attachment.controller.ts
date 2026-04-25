import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/usuario/auth.guard';
import { AttachmentDto } from './dto/attachment.dto';
import { AttachmentService } from './attachment.service';
import type { UploadedAttachmentFile } from './attachment.service';

@Controller('attachmentcontroller')
@ApiBearerAuth()
export class AttachmentController {
  constructor(private readonly service: AttachmentService) {}

  @UseGuards(AuthGuard)
  @Get()
  getAll() {
    return this.service.getAll();
  }

  @UseGuards(AuthGuard)
  @Get('getbyid/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @UseGuards(AuthGuard)
  @Get('getbynote/:noteId')
  getByNoteId(@Param('noteId', ParseIntPipe) noteId: number) {
    return this.service.getByNoteId(noteId);
  }

  @UseGuards(AuthGuard)
  @Post('save')
  async save(@Body() data: AttachmentDto) {
    return await this.service.save(data);
  }

  @UseGuards(AuthGuard)
  @Post('upload/:noteId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  async upload(
    @Param('noteId', ParseIntPipe) noteId: number,
    @UploadedFile() file: UploadedAttachmentFile,
  ) {
    return await this.service.upload(noteId, file);
  }

  @UseGuards(AuthGuard)
  @Get('download/:id')
  async download(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const attachment = await this.service.getFileById(id);

    res.setHeader('Content-Type', attachment.filetype);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${attachment.filename}"`,
    );

    res.send(attachment.filedata);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.service.delete(id);
  }
}
