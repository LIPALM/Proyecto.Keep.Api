import {
  IsBase64,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class AttachmentDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty({ message: 'El nombre del archivo es obligatorio' })
  @IsString()
  @MaxLength(255)
  filename!: string;

  @IsNotEmpty({ message: 'El tipo de archivo es obligatorio' })
  @IsString()
  @MaxLength(100)
  filetype!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  filesize?: number;

  @IsNotEmpty({ message: 'El contenido del archivo es obligatorio' })
  @IsString()
  @IsBase64({}, { message: 'filedata debe ser un string en base64' })
  filedata!: string;

  @IsNotEmpty({ message: 'El id de la nota es obligatorio' })
  @IsNumber()
  @Min(1)
  noteId!: number;
}
