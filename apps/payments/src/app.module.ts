import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsModule } from './payments/payments.module';
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "mysql_db",
      port: 3306,
      // url: "mysql://kenny_db:kenny@mysql_db:3306/nestjs_db",
      database: "nestjs_db",
      entities: [],
      synchronize: true,
      username: "kenny_db",
      password: "kenny",
      logging: true,  // Add this for debugging
      logger: "advanced-console"
    }),
    PaymentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
