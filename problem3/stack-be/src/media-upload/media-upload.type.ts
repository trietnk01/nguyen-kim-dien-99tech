import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class MediaUploadType {
  @Field((type) => Boolean)
  status: boolean;

  @Field((type) => String)
  message: string;

  @Field((type) => String)
  media_file_name: string;
}
