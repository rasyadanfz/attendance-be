import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const PHOTO_EXTENSIONS: Record<string, string> = {
    'image/jpeg': ".jpg",
    'image/png': ".png"
}

@Injectable()
export class PhotoStorageService {
    private directory: string

    constructor(){
        this.directory = "./uploads"
    }

    async save(photo: Express.Multer.File): Promise<string> {
        await mkdir(this.directory, { recursive: true });
        const filename = `${randomUUID()}${PHOTO_EXTENSIONS[photo.mimetype] ?? ''}`
        await writeFile(join(this.directory, filename), photo.buffer);
        return filename;
    }

    async remove(filename: string): Promise<void> {
        await unlink(join(this.directory, filename))
    }
}
