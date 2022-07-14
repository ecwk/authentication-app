import * as argon2 from 'argon2';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';

import { Profile } from './profile.schema';

export type UserDocument = User & Document & UserMethods;

@Schema()
export class User {
  @Prop({
    required: true,
    unique: true
  })
  id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop(
    raw({
      profilePicture: String,
      name: String,
      bio: String,
      phone: String
    })
  )
  profile: Profile;
}

const UserSchema = SchemaFactory.createForClass(User);

export type UserMethods = {
  validatePassword: (password: string) => Promise<boolean>;
};

UserSchema.methods.validatePassword = async function (
  this: UserDocument,
  password: string
) {
  return argon2.verify(this.password, password);
};

export { UserSchema };
