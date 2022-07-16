import { UserDocument } from '@modules/users';

export type RequestUser = Omit<UserDocument, 'password' | '_id' | '__v'>;
