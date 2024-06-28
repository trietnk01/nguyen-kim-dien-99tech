import { gql } from "@apollo/client";
const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      status
      message
      item {
        _id
        username
        display_name
        email
        token
      }
    }
  }
`;
const LOGOUT = gql`
  mutation Logout($id: String!) {
    logout(id: $id) {
      status
      message
    }
  }
`;
const CHECK_VALID_TOKEN = gql`
  mutation CheckValidToken($token: String!) {
    checkValidToken(token: $token) {
      status
      message
      item {
        _id
        username
        email
        display_name
        token
      }
    }
  }
`;
export { LOGIN, LOGOUT, CHECK_VALID_TOKEN };
