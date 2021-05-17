import { Controller, Get } from '@nestjs/common';
import { CityCodeInfoService } from './city-code-info.service';

@Controller('city-code-info')
export class CityCodeInfoController {
  constructor(private readonly cityCodeInfoService: CityCodeInfoService) {}

  @Get('allcity')
  async getCityInfo() {
    const result = this.cityCodeInfoService.getCityTreeData();
    return result;
    // [
    //   {
    //     value: '1-1',
    //     label: '1-1',
    //     children: [
    //       {
    //         value: '2-1',
    //         label: '2-1',
    //       },
    //     ],
    //   },
    // ];
  }
}
