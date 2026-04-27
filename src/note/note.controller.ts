import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
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
  getAll(@Req() req: any) {
    const usuarioId = req.user.sub;
    return this.service.getAll(usuarioId);
  }

  @UseGuards(AuthGuard)
  @Get('getactive')
  getActive(@Req() req: any) {
    const usuarioId = req.user.sub;
    return this.service.getActive(usuarioId);
  }

  @UseGuards(AuthGuard)
  @Get('getbyusuario/:usuarioId')
  getByUsuarioId(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.service.getByUsuarioId(usuarioId);
  }

  @UseGuards(AuthGuard)
  @Get('getbyid/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @UseGuards(AuthGuard)
  @Get('trash')
  getTrash(@Req() req: any) {
    const usuarioId = req.user.sub;
    return this.service.getTrash(usuarioId);
  }

  @UseGuards(AuthGuard)
  @Post('save')
  async save(@Body() data: NoteDto, @Req() req: any) {
    const usuarioId = req.user.sub;
    return await this.service.save(data, usuarioId);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const usuarioId = req.user.sub;
    return await this.service.delete(id, usuarioId);
  }

  @UseGuards(AuthGuard)
  @Post('restore/:id')
  async restore(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const usuarioId = req.user.sub;
    return await this.service.restore(id, usuarioId);
  }

  @UseGuards(AuthGuard)
  @Delete('permanent/:id')
  async permanentDelete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const usuarioId = req.user.sub;
    return await this.service.permanentDelete(id, usuarioId);
  }
}