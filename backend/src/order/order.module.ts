import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModule } from '../cart/cart.module';
import { PaymentModule } from '../payment/payment.module';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationModule } from '../notification/notification.module';
//import { JwtModule } from '@nestjs/jwt';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [CartModule, PaymentModule, NotificationModule, AuthModule, SupabaseModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
