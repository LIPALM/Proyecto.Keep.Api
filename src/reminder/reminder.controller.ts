import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/usuario/auth.guard';
import { ReminderService } from './reminder.service';
import { ReminderDto } from './dto/reminder.dto';

@Controller('remindercontroller')
@ApiBearerAuth()
export class ReminderController {
  constructor(private readonly service: ReminderService) {}

  @UseGuards(AuthGuard)
  @Get()
  getAll() {
    return this.service.getAll();
  }

  @UseGuards(AuthGuard)
  @Get('getpending')
  getPending() {
    return this.service.getPending();
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
  async save(@Body() data: ReminderDto) {
    return await this.service.save(data);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.service.delete(id);
  }
}
