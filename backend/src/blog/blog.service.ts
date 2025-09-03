import { Injectable } from '@nestjs/common';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  private blogs: Blog[] = [];

  findAll(): Blog[] {
    return this.blogs;
  }

  findOne(id: string): Blog | undefined {
    return this.blogs.find(blog => blog.id === id);
  }

  create(createBlogDto: CreateBlogDto): Blog {
    const newBlog: Blog = {
      id: (Math.random() * 1000000).toFixed(0),
      ...createBlogDto,
      tags: createBlogDto.tags ?? [],
      published: createBlogDto.published ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogs.push(newBlog);
    return newBlog;
  }

  update(id: string, updateBlogDto: UpdateBlogDto): Blog | undefined {
    const blog = this.findOne(id);
    if (blog) {
      Object.assign(blog, updateBlogDto, { updatedAt: new Date().toISOString() });
    }
    return blog;
  }

  remove(id: string): boolean {
    const index = this.blogs.findIndex(blog => blog.id === id);
    if (index !== -1) {
      this.blogs.splice(index, 1);
      return true;
    }
    return false;
  }
}
