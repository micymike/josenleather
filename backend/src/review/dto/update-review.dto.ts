export class UpdateReviewDto {
  rating?: number; // 1-5
  comment?: string;
  status?: 'pending' | 'approved' | 'rejected';
}
