import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class FeedbackService {
  private readonly feedbackFile = path.resolve(__dirname, '../../feedback.json');

  async appendFeedback(feedback: any): Promise<void> {
    let feedbacks: any[] = [];
    try {
      const data = await fs.readFile(this.feedbackFile, 'utf8');
      feedbacks = JSON.parse(data);
      if (!Array.isArray(feedbacks)) feedbacks = [];
    } catch (err) {
      // If file doesn't exist, start with empty array
      feedbacks = [];
    }
    feedbacks.push(feedback);
    await fs.writeFile(this.feedbackFile, JSON.stringify(feedbacks, null, 2), 'utf8');
  }

  async getAllFeedback(): Promise<any[]> {
    try {
      const data = await fs.readFile(this.feedbackFile, 'utf8');
      const feedbacks = JSON.parse(data);
      return Array.isArray(feedbacks) ? feedbacks : [];
    } catch (err) {
      // If file doesn't exist, return empty array
      return [];
    }
  }
}
