import { Injectable } from '@nestjs/common';
import * as zookeeper from 'node-zookeeper-client';

@Injectable()
export class ZookeeperService {
  private zkClient: zookeeper.zkClient;
  private range = { start: 0, curr: 0, end: 0 };

  constructor() {
    this.zkClient = zookeeper.createClient('localhost:2181');
    this.zkClient.connect();
    this.zkClient.once('connected', async () => {
      console.log('Connected to the ZK server.');
      await this.checkIfTokenExists();
      await this.getTokenRange();
      console.log('start', this.range.start);
    });
  }

  public getTokenRange() {
    new Promise((resolve, reject) => {
      this.zkClient.getData('/token', async (error, data) => {
        if (error) {
          console.log(error.stack);
          reject(error);
          return;
        }

        console.log('Current counter is ', data.toString());

        this.range.start = parseInt(data.toString()) + 1000000;
        this.range.curr = parseInt(data.toString()) + 1000000;
        this.range.end = parseInt(data.toString()) + 2000000;

        const result = await this.setTokenRange(this.range.start);
        resolve(result);
      });
    });
  }

  private async setTokenRange(token) {
    const dataToSet = Buffer.from(String(token), 'utf8');

    return new Promise((resolve, reject) => {
      this.zkClient.setData('/token', dataToSet, (error, stat) => {
        if (error) {
          console.log(error.stack);
          reject(error);
          return;
        }
        console.log('Data is set.');
        resolve(stat);
      });
    });
  }

  hashGenerator(n: number) {
    const hash =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let hash_str = '';

    while (n > 0) {
      hash_str += hash[n % 62];
      n = Math.floor(n / 62);
    }

    return hash_str;
  }

  public getRange() {
    return this.range;
  }

  private async createToken() {
    const buffer = Buffer.from('0', 'utf8');
    return new Promise((resolve, reject) => {
      this.zkClient.create(
        '/token',
        buffer,
        zookeeper.CreateMode.PERSISTENT,
        (error, path) => {
          if (error) {
            console.log(error.stack);
            reject(error);
          } else {
            console.log('Node: %s is created.', path);
            resolve(path);
          }
        },
      );
    });
  }

  private async checkIfTokenExists() {
    return new Promise((resolve, reject) => {
      this.zkClient.exists('/token', async (error, stat) => {
        if (error) {
          console.log(error.stack);
          reject(error);
          return;
        }

        if (stat) {
          console.log('Node exists: %s', stat);
          resolve(true);
        } else {
          await this.createToken();
          resolve(false);
        }
      });
    });
  }
}
