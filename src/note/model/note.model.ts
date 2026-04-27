import { Usuario } from 'src/usuario/model/usuario.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Usuario, { nullable: false, eager: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario!: Usuario;

  @Column({ length: 150 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ default: true })
  activo!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at?: Date; // 👈 Campo para soft delete
}