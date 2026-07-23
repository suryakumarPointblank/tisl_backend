import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Query, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { StorageService } from '../../infrastructure/storage/storage.service';

const ALLOWED_MIME = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  'application/pdf',
  'video/mp4', 'video/webm',
  'audio/mpeg', 'audio/mp4',
];

const MAX_SIZE = 100 * 1024 * 1024; // 100 MB

@ApiTags('Upload')
@Controller('admin/upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UploadController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a file to GCS' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_SIZE } }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ): Promise<{ url: string }> {
    if (!file) throw new BadRequestException('No file provided');
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} not allowed`);
    }
    const url = await this.storageService.uploadFile(file, folder ?? 'uploads');
    return { url };
  }
}
