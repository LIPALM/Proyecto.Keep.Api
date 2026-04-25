import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class NoteDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty({ message: 'El titulo es obligatorio' })
  @IsString()
  @MinLength(1, { message: 'El titulo no puede estar vacio' })
  @MaxLength(150, { message: 'El titulo no debe exceder 150 caracteres' })
  title!: string;

  @IsNotEmpty({ message: 'El contenido es obligatorio' })
  @IsString()
  content!: string;

  @IsOptional()
  @IsBoolean({ message: 'activo debe ser true o false' })
  activo?: boolean;
}
