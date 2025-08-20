export class Blog {
  id: string;
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  published: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}
