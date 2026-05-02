import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { LoginService } from './login/login.service';
import { LoginController } from './login/login.controller';
import { LoginModule } from './login/login.module';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AttendanceService } from './attendance/attendance.service';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule, LoginModule, UserModule, AttendanceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
