import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { AdminModule } from './admin/admin.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { SupabaseModule } from './supabase/supabase.module';
import { GeocodeModule } from './geocode/geocode.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SupabaseModule,
    AuthModule,
    PaymentModule,
    AdminModule,
    ProductModule,
    OrderModule,
    GeocodeModule,
    FeedbackModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: parseInt(process.env.RATE_TTL || '60', 10),
          limit: parseInt(process.env.RATE_LIMIT || '60', 10),
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
