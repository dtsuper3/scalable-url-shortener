import { Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Url } from './entities/url.entity';
import { Model } from 'mongoose';
import { ZookeeperService } from 'src/shared/zookeeper/zookeeper.service';

@Injectable()
export class UrlsService {
  constructor(
    @InjectModel(Url.name) private urlModel: Model<Url>,
    private readonly zookeeperService: ZookeeperService,
  ) {}

  async create(createUrlDto: CreateUrlDto) {
    const range = this.zookeeperService.getRange();
    console.log('range', range);
    if (range.curr < range.end - 1 && range.curr != 0) {
      range.curr++;
    } else {
      await this.zookeeperService.getTokenRange();
      range.curr++;
    }

    return this.urlModel.create({
      originalUrl: createUrlDto.url,
      shortUrl: this.zookeeperService.hashGenerator(range.curr - 1),
    });
  }

  findAll() {
    return this.urlModel.find();
  }

  findOne(hash: string) {
    return this.urlModel.findOne({
      shortUrl: hash,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateUrlDto: UpdateUrlDto) {
    return `This action updates a #${id} url`;
  }

  remove(id: number) {
    return `This action removes a #${id} url`;
  }
}
