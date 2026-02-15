import {
  Controller,
  Req,
  UseGuards,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() dto: any) {
    const userId = req.user.userId;
    return this.postsService.create(userId, dto);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') postId: number) {
    return this.postsService.findOne(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Req() req: any, @Param('id') postId: number, @Body() dto: any) {
    const userId = req.user.userId;
    return this.postsService.update(postId, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Req() req: any, @Param('id') postId: number) {
    const userId = req.user.userId;
    const role = req.user.role;
    // or  const {userId, role} = req.user;
    return this.postsService.delete(postId, userId, role);
  }
}
