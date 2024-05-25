/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductSchema } from '../schema/product.schema';
import { KafkaModule } from '@app/common/kafka/kafka.module';
import { ProductConsumer} from '../../test.product';
import { HomeModule } from 'apps/home/src/home.module';
import { AuthenticationGuard } from 'apps/authentication/src/authentication.guard';
import { AuthenticationModule } from 'apps/authentication/src/authentication.module';
import { AuthenticationService } from 'apps/authentication/src/authentication.service';
import { JwtStrategy } from 'apps/authentication/src/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from 'apps/authentication/schemas/user.schema';
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://mohamed:mohamed@cluster0.7jkva8p.mongodb.net/Products?retryWrites=true&w=majority&appName=Cluster0',
    ),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema },{ name: 'User', schema: UserSchema },]),
    KafkaModule,
    HomeModule,
    AuthenticationModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService,ProductConsumer,AuthenticationGuard,AuthenticationService,JwtStrategy,],
})
export class ProductModule {}
