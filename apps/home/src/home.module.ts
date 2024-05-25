/* eslint-disable prettier/prettier */
// home.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { FavoriteSchema } from '../schema/home.schema';
import { KafkaModule } from '@app/common/kafka/kafka.module';
import { HomeConsumer } from '../../test.home';
import { AuthenticationGuard } from 'apps/authentication/src/authentication.guard';
import { AuthenticationModule } from 'apps/authentication/src/authentication.module';
import { AuthenticationService } from 'apps/authentication/src/authentication.service';
import { JwtStrategy } from 'apps/authentication/src/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from 'apps/authentication/schemas/user.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot(
      'mongodb+srv://mohamed:mohamed@cluster0.7jkva8p.mongodb.net/Home?retryWrites=true&w=majority&appName=Cluster0',
    ),
    MongooseModule.forFeature([
      { name: 'Favorite', schema: FavoriteSchema },
      { name: 'User', schema: UserSchema }, // Add User model to MongooseModule imports
    ]),
    KafkaModule,
    AuthenticationModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [HomeController],
  providers: [HomeService, HomeConsumer,AuthenticationGuard,AuthenticationService,JwtStrategy,],
  exports: [HomeService], // export HomeService
})
export class HomeModule {}