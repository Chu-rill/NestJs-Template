import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DatabaseModule } from 'src/infra/db/database.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [DatabaseModule],
})
export class AdminModule {}
