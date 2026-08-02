// backend/src/entities/movie.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  title!: string;

  // 나중에 포스터 이미지나 개봉일 등 필요한 정보가 생기면 여기에 추가하면 돼!
}
