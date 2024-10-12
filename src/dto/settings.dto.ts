import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class SettingsReponseDto {
  @Expose()
  searchOn: boolean;

  @Expose()
  addNew: boolean;

  @Expose()
  amount: number;

  constructor(partial: Partial<SettingsReponseDto>) {
    Object.assign(this, partial);
  }
}

export class SettingsUpdateDto {
  @IsOptional()
  @IsBoolean()
  searchOn?: boolean;

  @IsOptional()
  @IsBoolean()
  addNew?: boolean;

  @IsOptional()
  @IsNumber()
  amount?: number;
}

export class SettingsDto {
  @IsBoolean()
  searchOn: boolean;

  @IsBoolean()
  addNew: boolean;

  @IsNumber()
  amount: number;
}
