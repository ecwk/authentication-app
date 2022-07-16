import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import { Model, FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreateUserDto, UpdateUserDto } from './dto';
import { User, UserDocument } from './schema';
import { generateId } from '@common/utils';

type UserFilterQuery = FilterQuery<UserDocument>;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) {}

  async findAll(select = ''): Promise<UserDocument[]> {
    return this.userModel.find().select(select).exec();
  }

  async findOne(filter: UserFilterQuery, select = ''): Promise<UserDocument> {
    return this.userModel.findOne(filter).select(select).exec();
  }

  async create(
    createUserDto: CreateUserDto,
    select = ''
  ): Promise<UserDocument> {
    const { password, ...rest } = createUserDto;
    const createdUser = await new this.userModel({
      id: generateId(),
      password: password ? await argon2.hash(password) : undefined,
      ...rest
    }).save();

    return this.findOne({ _id: createdUser._id }, select);
  }

  async updateOne(
    filter: UserFilterQuery,
    updateUserDto: UpdateUserDto,
    select = ''
  ) {
    const { profile, ...user } = updateUserDto;
    const { profile: currentProfile, ...currentUser } = (
      await this.findOne(filter)
    ).toObject() as User;
    const hashedPassword = user.password && (await argon2.hash(user.password));
    const updatedUser = await this.userModel.findOneAndUpdate(filter, {
      ...currentUser,
      ...user,
      password: hashedPassword || currentUser.password,
      profile: {
        ...currentProfile,
        ...profile
      }
    });
    return this.findOne({ _id: updatedUser._id }, select);
  }

  async updateProfilePicture(
    filter: UserFilterQuery,
    profilePicture: string,
    select = ''
  ) {
    const userToUpdate = (await this.findOne(filter)).toObject();
    const updatedUser = await this.userModel.findOneAndUpdate(filter, {
      profile: {
        ...userToUpdate.profile,
        profilePicture,
        foo: 'bar'
      }
    });
    return this.findOne({ _id: updatedUser._id }, select);
  }
}
