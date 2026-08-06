// backend/src/entities/movie.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  title!: string;

  @Column({ type: 'varchar', nullable: true })
  poster!: string | null;
}
