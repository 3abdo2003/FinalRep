import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { KafkaModule } from '@app/common/kafka/kafka.module';
import { TestConsumer } from '../../test.consumer';
import { UserSchema } from '../schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://mohamed:mohamed@cluster0.7jkva8p.mongodb.net/authentication-db?retryWrites=true&w=majority&appName=Cluster0',
    ),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    KafkaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, TestConsumer, JwtStrategy],
})
export class AuthenticationModule {}
