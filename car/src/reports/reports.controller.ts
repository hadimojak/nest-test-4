import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/users.entity';
import { ReportDto } from './dto/report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApproveReportDto } from './dto/Approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dto/get-estimate.dto';
import { CreateBulkReportDto } from './dto/create-bulk-report.dto';
import { Report } from './reports.entity';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Post('/bulk')
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createBulkReport(
    @Body() body: CreateBulkReportDto,
    @CurrentUser() user: User,
  ): Promise<Report[]> {
    return this.reportsService.bulkCreate(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(
    @Param() params: { id: string },
    @Body() body: ApproveReportDto,
  ) {
    return this.reportsService.changeApproval(params.id, body.approved);
  }

  @Get()
  getEstimate(@Query() query: GetEstimateDto): Promise<Report[]> {
    return this.reportsService.createEstimate(query);
  }
}
