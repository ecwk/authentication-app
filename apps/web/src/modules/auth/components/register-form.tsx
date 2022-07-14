import {
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  FlexProps,
  FormControl,
  FormErrorMessage,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { MdEmail, MdLock } from 'react-icons/md';
import { yupResolver } from '@hookform/resolvers/yup';

import { createUserSchema } from 'src/modules/users/schema';
import { usersApiClient } from 'src/modules/users/api';
import { AxiosError } from 'axios';
import { theme } from 'src/config';

type RegisterFormData = {
  email: string;
  password: string;
};

export const RegisterForm = (props: FlexProps) => {
  const toast = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors }
  } = useForm<RegisterFormData>({
    resolver: yupResolver(createUserSchema)
  });
  const registerMutation = useMutation(
    (registerFormData: RegisterFormData) => {
      return usersApiClient.register({
        ...registerFormData,
        profile: {
          name: registerFormData.email.split('@')[0]
        }
      });
    },
    {
      onMutate: () => {
        setIsSubmitting(true);
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          const status = err.response?.status;
          if (status === 400) {
            // Nestjs validation returns arrays of errors
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
                duration: 3000,
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
      onSuccess: (user) => {
        const { email } = user;
        router.push('/login');
        toast({
          title: 'Account created',
          description: `Email ${email} has been created`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top'
        });
      },
      onSettled: () => {
        setIsSubmitting(false);
      }
    }
  );

  return (
    <Flex
      as="form"
      flexDir="column"
      onSubmit={handleSubmit((registerFormData) => {
        registerMutation.mutate(registerFormData);
      })}
      {...props}
    >
      <FormControl isInvalid={!!formErrors.email} mb={3}>
        <InputGroup>
          <InputLeftElement top="50%" transform="translateY(-50%)">
            <MdEmail size="25px" color={theme.colors.brandGray} />
          </InputLeftElement>
          <Input
            {...register('email')}
            type="text"
            placeholder="Email"
            size="lg"
            _placeholder={{
              fontWeight: 'normal',
              fontSize: 'md'
            }}
          />
        </InputGroup>
        <FormErrorMessage mb={1}>{formErrors.email?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!formErrors.password} mb={5}>
        <InputGroup>
          <InputLeftElement top="50%" transform="translateY(-50%)">
            <MdLock size="25px" color={theme.colors.brandGray} />
          </InputLeftElement>
          <Input
            {...register('password')}
            type="password"
            placeholder="Password"
            size="lg"
            _placeholder={{
              fontWeight: 'normal',
              fontSize: 'md'
            }}
          />
        </InputGroup>
        <FormErrorMessage mb={1}>
          {formErrors.password?.message}
        </FormErrorMessage>
      </FormControl>
      <Button type="submit" isLoading={isSubmitting}>
        Start coding now
      </Button>
    </Flex>
  );
};
