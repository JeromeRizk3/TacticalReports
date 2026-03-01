import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CampaignInteractionsService } from './campaign-interactions.service';
import { CreateCampaignInteractionDto } from './dto/create-campaign-interaction.dto';

@Controller('campaign-interactions')
export class CampaignInteractionsController {
  constructor(
    private readonly campaignInteractionsService: CampaignInteractionsService,
  ) {}

  @Post()
  create(@Body() body: CreateCampaignInteractionDto) {
    return this.campaignInteractionsService.create(
      body.user_id,
      body.report_id,
      body.campaign_type,
      body.action,
    );
  }

  @Get()
  findAll() {
    return this.campaignInteractionsService.findAll();
  }

  @Get('user/:user_id')
  findByUserId(@Param('user_id') user_id: string) {
    return this.campaignInteractionsService.findByUserId(user_id);
  }

  @Get('report/:report_id')
  findByReportId(@Param('report_id') report_id: string) {
    return this.campaignInteractionsService.findByReportId(report_id);
  }

  @Get('campaign/:campaign_type')
  findByCampaignType(@Param('campaign_type') campaign_type: string) {
    return this.campaignInteractionsService.findByCampaignType(campaign_type);
  }
}
