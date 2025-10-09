import { Controller, Post, Body, Get } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async createFeedback(@Body() feedback: any) {
    await this.feedbackService.appendFeedback(feedback);
    return { message: 'Feedback received' };
  }

  @Get()
  async getAllFeedback() {
    const feedbacks = await this.feedbackService.getAllFeedback();
    return feedbacks;
  }
}
