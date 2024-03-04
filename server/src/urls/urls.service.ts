import { Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Url } from './entities/url.entity';
import { Model } from 'mongoose';

@Injectable()
export class UrlsService {
  constructor(@InjectModel(Url.name) private catModel: Model<Url>) {}

  create(createUrlDto: CreateUrlDto) {
    return this.catModel.create({
      url: createUrlDto.url,
      shortUrl: Math.random().toString(36).substring(2, 5),
    });
  }

  findAll() {
    return this.catModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} url`;
  }

  update(id: number, updateUrlDto: UpdateUrlDto) {
    return `This action updates a #${id} url`;
  }

  remove(id: number) {
    return `This action removes a #${id} url`;
  }
}
