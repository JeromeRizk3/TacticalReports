import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ViewHistoryService } from './view-history.service';

@Controller('view-history')
export class ViewHistoryController {
  constructor(private readonly viewHistoryService: ViewHistoryService) {}

  @Post()
  create(
    @Body()
    body: {
      user_id: string;
      report_id: string;
      dwell_time_seconds: number;
    },
  ) {
    return this.viewHistoryService.create(
      body.user_id,
      body.report_id,
      body.dwell_time_seconds,
    );
  }

  @Get()
  findAll() {
    return this.viewHistoryService.findAll();
  }

  @Get('user/:user_id')
  findByUserId(@Param('user_id') user_id: string) {
    return this.viewHistoryService.findByUserId(user_id);
  }

  @Get('report/:report_id')
  findByReportId(@Param('report_id') report_id: string) {
    return this.viewHistoryService.findByReportId(report_id);
  }
}
