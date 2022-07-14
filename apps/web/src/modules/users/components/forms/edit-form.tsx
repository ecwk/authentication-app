import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Box,
  Button,
  Input,
  Textarea,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';

import { ImageUploadInput } from 'src/components';
import { updateUserSchema } from '../../schema';
import { User } from 'src/modules/users/types';
import { usersApiClient } from '../../api';

type EditFormData = {
  name?: string;
  bio?: string;
  phone?: string;
  email?: string;
  password?: string;
};

type EditFormProps = {
  user: User;
};

export const EditForm = ({ user }: EditFormProps) => {
  const toast = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [isRemovePicture, setIsRemovePicture] = useState<boolean>(() => {
    return user?.profile?.profilePicture ? false : true;
  });
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors }
  } = useForm<EditFormData>({
    resolver: (data, context, options) => {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value !== '')
      );
      return yupResolver(updateUserSchema)(filteredData, context, options);
    }
  });
  const editMutation = useMutation(
    async (editFormData: EditFormData) => {
      const resDeletePic =
        isRemovePicture && usersApiClient.deleteProfilePicture(user.id);
      const resUploadPic =
        !isRemovePicture &&
        profilePicture &&
        usersApiClient.uploadProfilePicture(user.id, profilePicture);

      const { email, password, ...profile } = editFormData;
      const resUpdateUser = usersApiClient.updateUserById(user.id, {
        email,
        password,
        profile
      });

      const [, , finalUserState] = await Promise.all([
        resDeletePic,
        resUploadPic,
        resUpdateUser
      ]);
      return finalUserState;
    },
    {
      onMutate: () => {
        setIsSubmitting(true);
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          const status = err.response?.status;
          if (status === 400) {
            // class-validator returns arrays of errors
            const responseMessages = err.response?.data?.message;
            let serverErrors: string[] = [];
            if (err.response?.data?.message instanceof Array) {
              serverErrors = responseMessages;
            } else {
              serverErrors.push(responseMessages);
            }
            serverErrors.forEach((error) => {
              const capitalisedError =
                error.charAt(0).toUpperCase() + error.slice(1);
              toast({
                title: 'Error',
                description: capitalisedError,
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: 'top'
              });
            });
          } else {
            const error = err.response?.data?.error;
            const message = err.response?.data?.message;
            const title = error || message;
            const description = error ? message : undefined;
            toast({
              title,
              description,
              status: 'error',
              duration: 9000,
              position: 'top'
            });
          }
        }
      },
      onSuccess: () => {
        toast({
          title: 'Account updated',
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top'
        });
        setTimeout(() => {
          router.reload();
        }, 500);
      },
      onSettled: () => {
        setIsSubmitting(false);
      }
    }
  );

  return (
    <Box
      as="form"
      onSubmit={handleSubmit((editFormDto) => {
        editMutation.mutate(editFormDto);
      })}
    >
      <ImageUploadInput
        user={user}
        image={profilePicture}
        setImage={setProfilePicture}
        removeImage={isRemovePicture}
        setRemoveImage={setIsRemovePicture}
        containerProps={{
          mt: 8,
          alignItems: 'center'
        }}
      />
      <FormControl mt={8} isInvalid={!!formErrors.name}>
        <FormLabel color="#4F4F4F">Name</FormLabel>
        <Input
          {...register('name')}
          type="text"
          size="lg"
          placeholder={user?.profile?.name || 'Enter your name...'}
        />
        <FormErrorMessage mb={1}>{formErrors.name?.message}</FormErrorMessage>
      </FormControl>
      <FormControl mt={6} isInvalid={!!formErrors.bio}>
        <FormLabel color="#4F4F4F">Bio</FormLabel>
        <Textarea
          {...register('bio')}
          size="lg"
          placeholder={user?.profile?.bio || 'Enter your bio...'}
        />
        <FormErrorMessage mb={1}>{formErrors.bio?.message}</FormErrorMessage>
      </FormControl>
      <FormControl mt={6} isInvalid={!!formErrors.phone?.message}>
        <FormLabel color="#4F4F4F">Phone</FormLabel>
        <Input
          {...register('phone')}
          type="text"
          size="lg"
          placeholder={user?.profile?.phone || 'Enter your phone...'}
        />
        <FormErrorMessage mb={1}>{formErrors.phone?.message}</FormErrorMessage>
      </FormControl>
      <FormControl mt={6} isInvalid={!!formErrors.email}>
        <FormLabel htmlFor="name" color="#4F4F4F">
          Email
        </FormLabel>
        <Input
          {...register('email')}
          type="email"
          size="lg"
          placeholder={user?.email || 'Enter your email...'}
        />
        <FormErrorMessage mb={1}>{formErrors.email?.message}</FormErrorMessage>
      </FormControl>
      <FormControl mt={6} isInvalid={!!formErrors.password}>
        <FormLabel htmlFor="name" color="#4F4F4F">
          Password
        </FormLabel>
        <Input
          {...register('password')}
          type="password"
          size="lg"
          placeholder="Enter your new password..."
        />
        <FormErrorMessage mb={1}>
          {formErrors.password?.message}
        </FormErrorMessage>
      </FormControl>
      <Button type="submit" isLoading={isSubmitting} mt={6}>
        Save
      </Button>
    </Box>
  );
};
