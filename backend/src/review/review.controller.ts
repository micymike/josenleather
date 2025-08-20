import { Controller } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // TODO: Add endpoints for managing customer reviews and ratings
}
