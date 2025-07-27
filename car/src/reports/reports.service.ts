import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './reports.entity';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async create(
    reportDto: CreateReportDto,
    user: User,
  ): Promise<CreateReportDto> {
    const report = this.repo.create(reportDto);
    report.user = user;

    await this.repo.save(report);
    return report;
  }
}
