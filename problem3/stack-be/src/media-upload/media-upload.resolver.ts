import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload-ts";
import { MediaUploadService } from "./media-upload.service";
import { MediaUploadType } from "./media-upload.type";

@Resolver(() => MediaUploadType)
export class MediaUploadResolver {
  constructor(private readonly mediaUploadService: MediaUploadService) {}
  @Mutation(() => MediaUploadType)
  uploadImage(@Args("image_file", { type: () => GraphQLUpload }) image_file: FileUpload) {
    return this.mediaUploadService.uploadImage(image_file);
  }
}
