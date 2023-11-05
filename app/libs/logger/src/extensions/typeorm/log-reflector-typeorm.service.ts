import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogReflectorTypeOrm } from './log-typeorm';

@Injectable()
export class LogReflectorTypeOrmService {
  constructor(
    @InjectRepository(LogReflectorTypeOrm)
    private logsRepository: Repository<LogReflectorTypeOrm>,
  ) {}

  async createLog(log: any) {
    const newLog = await this.logsRepository.create(log);
    await this.logsRepository.save(newLog, {
      data: {
        isCreatingLogs: true,
      },
    });
    return newLog;
  }
}
