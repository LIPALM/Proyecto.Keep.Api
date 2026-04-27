import { Note } from 'src/note/model/note.model';
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
export class Reminder {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp' })
  remind_at!: Date;

  @Column({ default: false })
  is_completed!: boolean;

  @Column({ default: true })
  activo!: boolean;

  @ManyToOne(() => Note, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'note_id' })
  note!: Note;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
