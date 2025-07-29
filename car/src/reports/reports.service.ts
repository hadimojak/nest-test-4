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

  async createEstimate({
    model,
    make,
    lng,
    lat,
    mileage,
    year,
  }: GetEstimateDto): Promise<{ price: string | null }> {
    console.log({ lat, lng });

    const result = (await this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make=:make COLLATE NOCASE', { make })
      .andWhere('model=:model COLLATE NOCASE', { model })
      .andWhere('lng - :lng BETWEEN -10 AND 10', { lng })
      .andWhere('lat - :lat BETWEEN -10 AND 10', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('mileage- :mileage', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne()) as { price: string | null };

    return result;
  }
}
