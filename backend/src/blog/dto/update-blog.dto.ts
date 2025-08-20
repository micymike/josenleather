export class UpdateBlogDto {
  title?: string;
  content?: string;
  tags?: string[];
  published?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}
