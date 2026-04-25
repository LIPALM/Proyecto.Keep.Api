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
import { NoteService } from './note.service';
import { NoteDto } from './dto/note.dto';

@Controller('notecontroller')
@ApiBearerAuth()
export class NoteController {
  constructor(private readonly service: NoteService) {}

  @UseGuards(AuthGuard)
  @Get()
  getAll() {
    return this.service.getAll();
  }

  @UseGuards(AuthGuard)
  @Get('getactive')
  getActive() {
    return this.service.getActive();
  }

  @UseGuards(AuthGuard)
  @Get('getbyid/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @UseGuards(AuthGuard)
  @Post('save')
  async save(@Body() data: NoteDto) {
    return await this.service.save(data);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.service.delete(id);
  }
}
