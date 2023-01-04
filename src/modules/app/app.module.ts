import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "../users/users.module";
//import { AuthModule } from "../auth/auth.module";
//import { AuthController } from "../auth/auth.controller";
//import { DbModule } from "@/modules/_db/db.module";
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    //DbModule,
    UsersModule,
    //AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          uri: "mongodb+srv://test:test@cluster0.wubrolv.mongodb.net/test",
          dbName: 'test',
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
