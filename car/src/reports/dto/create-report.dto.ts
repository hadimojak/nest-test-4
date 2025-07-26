/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsNumber,
  IsString,
  IsLatitude,
  IsLongitude,
  Min,
  Max,
} from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @IsLongitude()
  lng: string;

  @IsLatitude()
  lat: string;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;
}
