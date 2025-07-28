import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './reports.entity';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { CreateBulkReportDto } from './dto/create-bulk-report.dto';
import { GetEstimateDto } from './dto/get-estimate.dto';

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

  async bulkCreate(
    reportDto: CreateBulkReportDto,
    user: User,
  ): Promise<Report[]> {
    const reports = this.repo.create(reportDto.reports);
    reports.map((val) => (val.user = user));

    await this.repo.save(reports);
    return reports;
  }

  async changeApproval(id: string, approved: boolean): Promise<Report> {
    const report = await this.repo.findOne({ where: { id: +id } });
    if (!report) throw new NotFoundException('report not found');

    report.approved = approved;
    return this.repo.save(report);
  }

  async createEstimate(estimateDto: GetEstimateDto): Promise<Report[] | any> {
    console.log({ estimateDto });

    const result = await this.repo
      .createQueryBuilder()
      .select('*')
      .getRawMany();
    console.log({ result });
  }
}
