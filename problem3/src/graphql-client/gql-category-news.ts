import { gql } from "@apollo/client";
const FIND_ALL_CATEGORY_NEWS_AUTHENTICATED = gql`
  query FindAllCategoryNewsUnauthenticated {
    findAllCategoryNewsUnauthenticated {
      status
      message
      list {
        _id
        category_name
      }
    }
  }
`;
export { FIND_ALL_CATEGORY_NEWS_AUTHENTICATED };
