import { RegisterDto } from 'src/modules/auth/dto';
import { UpdateUserDto } from '../dto';
import { client } from '@config/axios';
import { User } from '../types';


const findUserById = async (id: string) => {
  const { data: user } = await client.get(`/users/${id}`);
  return user as User;
};

const register = async (registerDto: RegisterDto) => {
  const { data: user } = await client.post('/users', registerDto);
  return user as User;
};

const uploadProfilePicture = async (id: string, profilePicture: File) => {
  const formData = new FormData();
  formData.append('file', profilePicture);
  const { data: user } = await client.post(
    `/users/${id}/upload/profile-picture`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return user as User;
};

const deleteProfilePicture = async (id: string) => {
  const { data: user } = await client.delete(
    `/users/${id}/upload/profile-picture`
  );
  return user as User;
};

const updateUserById = async (id: string, updateUserDto: UpdateUserDto) => {
  const { data: user } = await client.patch(`/users/${id}`, updateUserDto);
  return user as User;
};

export const usersApiClient = {
  findUserById,
  register,
  uploadProfilePicture,
  deleteProfilePicture,
  updateUserById
};
