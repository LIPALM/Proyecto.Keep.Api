import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id!: number;

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
}
