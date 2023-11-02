import { Module } from '@nestjs/common';
import { DddService } from './ddd.service';

@Module({
  providers: [DddService],
  exports: [DddService],
})
export class DddModule {}
