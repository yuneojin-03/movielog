// backend/src/entities/like.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Review } from './review.entity';

@Entity('likes')
// 한 명의 유저가 같은 리뷰에 중복으로 좋아요를 누를 수 없도록 고유(Unique) 제약 조건 설정
@Unique(['user', 'review'])
export class Like {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'review_id' })
  review!: Review;
}
