import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [AuthModule, PaymentModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
