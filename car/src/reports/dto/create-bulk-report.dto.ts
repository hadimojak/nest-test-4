/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Type } from 'class-transformer';
import { ValidateNested, ArrayMinSize } from 'class-validator';
import { CreateReportDto } from './create-report.dto';

export class CreateBulkReportDto {
  @ValidateNested({ each: true })
  @Type(() => CreateReportDto)
  @ArrayMinSize(1)
  reports: CreateReportDto[];
}
