import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class ReminderDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty({ message: 'El titulo es obligatorio' })
  @IsString()
  @MaxLength(150)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty({ message: 'La fecha del recordatorio es obligatoria' })
  @IsDateString({}, { message: 'remind_at debe tener formato de fecha valida' })
  remind_at!: string;

  @IsOptional()
  @IsBoolean({ message: 'is_completed debe ser true o false' })
  is_completed?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'activo debe ser true o false' })
  activo?: boolean;

  @IsNotEmpty({ message: 'El id de la nota es obligatorio' })
  @IsNumber()
  @Min(1)
  noteId!: number;
}
