import { CreateMediaUploadInput } from './create-media-upload.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMediaUploadInput extends PartialType(CreateMediaUploadInput) {
  @Field(() => Int)
  id: number;
}
