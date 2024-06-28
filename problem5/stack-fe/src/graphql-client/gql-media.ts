import { gql } from "@apollo/client";
const UPLOAD_IMAGE = gql`
  mutation UploadImage($image_file: Upload!) {
    uploadImage(image_file: $image_file) {
      status
      message
      media_file_name
    }
  }
`;
export { UPLOAD_IMAGE };
