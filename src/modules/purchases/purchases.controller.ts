import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  create(@Body() body: CreatePurchaseDto) {
    return this.purchasesService.create(body.user_id, body.report_id);
  }

  @Get()
  findAll() {
    return this.purchasesService.findAll();
  }

  @Get('user/:user_id')
  findByUserId(@Param('user_id') user_id: string) {
    return this.purchasesService.findByUserId(user_id);
  }

  @Get('report/:report_id')
  findByReportId(@Param('report_id') report_id: string) {
    return this.purchasesService.findByReportId(report_id);
  }
}
