import { Module } from '@nestjs/common';
import { PhotoStorageService } from './photo-storage.service.js';

@Module({
  providers: [PhotoStorageService],
  exports: [PhotoStorageService]
})
export class PhotoStorageModule {}
