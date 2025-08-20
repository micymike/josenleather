export class CreateBlogDto {
  title: string;
  content: string;
  authorId: string;
  tags?: string[];
  published?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}
