import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: any) {
    const newPost = await this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        published: dto.published ?? false,
        authorId: userId,
      },
    });

    return {
      success: true,
      message: 'Post created successfully',
      data: newPost,
    };
  }

  async findAll() {
    return this.prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        comments: true,
      },
    });
  }

  async findOne(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        comments: true,
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return {
      success: true,
      message: 'Post found successfully',
      data: post,
    };
  }

  async update(postId: number, userId: number, dto: any) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('Unauthorized');
    }

    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data: {
        title: dto.title,
        content: dto.content,
        published: dto.published,
      },
    });

    return {
      success: true,
      message: 'Post updated successfully',
      data: updatedPost,
    };
  }

  async delete(postId: number, userId: number, role: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId && role !== 'admin') {
      throw new ForbiddenException('Unauthorized');
    }

    const deletePost = await this.prisma.post.delete({
      where: { id: postId },
    });

    return {
      success: true,
      message: 'Post deleted successfully',
      data: deletePost,
    };
  }
}
