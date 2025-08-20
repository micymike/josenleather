export class CreateReviewDto {
  productId: string;
  userId: string;
  rating: number; // 1-5
  comment: string;
  status?: 'pending' | 'approved' | 'rejected';
}
