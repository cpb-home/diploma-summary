import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Hotel, HotelSchema } from 'src/schemas/hotel.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { HotelRoom, HotelRoomSchema } from 'src/schemas/hotelRoom.schema';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string>('EXPIRESIN'),
          },
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Hotel.name, schema: HotelSchema},
      { name: HotelRoom.name, schema: HotelRoomSchema},
    ])
  ],
  controllers: [CommonController],
  providers: [CommonService, JwtStrategy, AuthService],
  exports: [CommonService]
})

export class CommonModule {}
