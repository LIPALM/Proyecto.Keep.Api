import { Note } from 'src/note/model/note.model';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  filename!: string;

  @Column({ length: 100 })
  filetype!: string;

  @Column({ type: 'int', nullable: true })
  filesize?: number;

  @Column({ type: 'bytea' })
  filedata!: Buffer;

  @ManyToOne(() => Note, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'note_id' })
  note!: Note;
}
