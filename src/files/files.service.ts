import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { config } from 'process';

@Injectable()
export class FilesService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      endpoint: this.configService.get<string>('S3_ENDPOINT') ?? '', 
      region: 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY') ?? '',
        secretAccessKey: this.configService.get<string>('S3_SECRET_KEY') ?? '',
      },
      forcePathStyle: true, 
    });
  }

  async uploadFile(file: Express.Multer.File,bucketName:string): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    
    const configKey = `S3_BUCKET_${bucketName.toUpperCase}` 

    const bucket = this.configService.get<string>(configKey) ?? bucketName;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket, 
        Key: fileName, 
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return fileName; 
  }
}