import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: dto.postId },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    // create comment
    const newComment = await this.prisma.comment.create({
      data: {
        content: dto.content,
        postId: dto.postId,
        authorId: userId,
      },
    });

    return {
      success: true,
      message: 'Comment created successfully',
      data: newComment,
    };
  }

  async findByPost(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: { author: { select: { name: true, email: true } } },
    });
  }

  async delete(commentId: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotAcceptableException('Comment not found!');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException("You cann't delete this comment");
    }

    const deletComment = await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return {
      success: true,
      message: 'Comment Deleted Successfully!',
      data: deletComment,
    };
  }
}
