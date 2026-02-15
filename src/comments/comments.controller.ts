import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateCommentDto } from './create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() dto: CreateCommentDto) {
    return this.commentService.create(req.user.userId, dto);
  }

  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.commentService.findByPost(Number(postId));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: string) {
    return this.commentService.delete(Number(id), req.user.userId);
  }
}
