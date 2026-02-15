import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('posts')
export class LikesController {
  constructor(private readonly likeService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Req() req: any, @Param('id') id: string) {
    return this.likeService.likePost(req.user.userId, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/unlike')
  dislike(@Req() req: any, @Param('id') id: number) {
    return this.likeService.unLikePost(req.user.userId, Number(id));
  }
}
