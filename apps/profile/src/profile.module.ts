import { Module, OnModuleInit } from '@nestjs/common';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { ProfileSchema } from '../schema/profile.schema';
import { ConsumerService } from '@app/common/kafka/consumer.service';
import { Connection } from 'mongoose';
import { KafkaModule } from '@app/common/kafka/kafka.module';
import { AuthenticationModule } from 'apps/authentication/src/authentication.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationGuard } from 'apps/authentication/src/authentication.guard';
import { JwtStrategy } from 'apps/authentication/src/jwt.strategy';
import { AuthenticationService } from 'apps/authentication/src/authentication.service';
import { UserSchema } from 'apps/authentication/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://mohamed:mohamed@cluster0.7jkva8p.mongodb.net/Profile?retryWrites=true&w=majority&appName=Cluster0',
    ),
    MongooseModule.forFeature([
      { name: 'Profile', schema: ProfileSchema },
      { name: 'User', schema: UserSchema },
    ]),
    HttpModule,
    KafkaModule,
    AuthenticationModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    ConsumerService,
    AuthenticationGuard,
    JwtStrategy,
    AuthenticationService,
  ],
  exports: [ProfileService], // Export ProfileService if needed in other modules
})
export class ProfileModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    const db = this.connection.db;
    const collections = await db.listCollections().toArray();
    if (collections.length > 0) {
      console.log('Connected to MongoDB');
    } else {
      console.log('Failed to connect to MongoDB');
    }
  }
}
