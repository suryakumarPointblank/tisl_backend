import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFavoriteEntity } from './user-favorite.entity';
import { ContentItemEntity } from '../content-item/content-item.entity';
import { UserFavoriteService } from './user-favorite.service';
import { UserFavoriteController } from './user-favorite.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserFavoriteEntity, ContentItemEntity])],
  controllers: [UserFavoriteController],
  providers: [UserFavoriteService],
  exports: [UserFavoriteService],
})
export class UserFavoriteModule {}
