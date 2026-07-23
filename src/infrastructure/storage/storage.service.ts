import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly storage: Storage;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    this.storage = new Storage({ keyFilename: this.config.get('GCS_KEY_FILE') });
    this.bucket = this.config.get<string>('GCS_BUCKET');
  }

  async uploadFile(file: Express.Multer.File, folder = 'uploads'): Promise<string> {
    const ext = path.extname(file.originalname);
    const filename = `${folder}/${uuidv4()}${ext}`;
    const bucket = this.storage.bucket(this.bucket);
    const blob = bucket.file(filename);

    await blob.save(file.buffer, { contentType: file.mimetype, resumable: false });

    return `https://storage.googleapis.com/${this.bucket}/${filename}`;
  }

  async deleteFile(publicUrl: string): Promise<void> {
    const prefix = `https://storage.googleapis.com/${this.bucket}/`;
    if (!publicUrl.startsWith(prefix)) return;
    const filename = publicUrl.slice(prefix.length);
    await this.storage.bucket(this.bucket).file(filename).delete({ ignoreNotFound: true });
  }
}
