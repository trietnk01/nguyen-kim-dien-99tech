import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import { FileUpload } from "graphql-upload-ts";
import { join } from "path";

@Injectable()
export class MediaUploadService {
  uploadImage = async (image_file: FileUpload) => {
    let status: boolean = true;
    let message: string = "";
    let media_file_name: string = "";
    try {
      const { createReadStream, filename } = await image_file;
      if (filename) {
        media_file_name = filename;
        const pathName = join(process.cwd(), `./public/images/${media_file_name}`);
        await createReadStream().pipe(fs.createWriteStream(pathName));
      }
    } catch (err) {
      status = false;
      message = err.message;
    }
    return { status, message, media_file_name };
  };
}
