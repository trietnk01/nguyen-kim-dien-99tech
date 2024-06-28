import { Module } from '@nestjs/common';
import { MediaUploadService } from './media-upload.service';
import { MediaUploadResolver } from './media-upload.resolver';

@Module({
  providers: [MediaUploadResolver, MediaUploadService],
})
export class MediaUploadModule {}
