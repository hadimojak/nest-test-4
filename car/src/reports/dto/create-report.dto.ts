/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNumber, IsString } from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  price: number;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  year: number;

  @IsString()
  lng: string;

  @IsString()
  lat: string;

  @IsNumber()
  mileage: number;
}
