export interface CustomUser extends Express.User {
  _id: string;
  key: string;
  user_uid: string;
  expires: any;
  roles: string[];
  provider: string;
}
