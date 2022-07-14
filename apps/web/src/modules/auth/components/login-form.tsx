import {
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  FlexProps,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { MdEmail, MdLock } from 'react-icons/md';

import { theme } from 'src/config';
import { useAuth } from '../hooks';
import { LoginDto } from '../dto';

export const LoginForm = (props: FlexProps) => {
  const { login } = useAuth();
  const toast = useToast();
  const { register, handleSubmit } = useForm<LoginDto>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loginMutation = useMutation(
    ({ email, password }: LoginDto) => {
      return login(email, password);
    },
    {
      onMutate: () => {
        setIsSubmitting(true);
      },
      onError(err) {
        if (err instanceof AxiosError) {
          let title: string;
          let description: string;
          const status = err.response?.status;
          if (status === 401) {
            title = 'Invalid credentials';
            description = 'Please check your email and password';
          } else {
            const error = err.response?.data?.error;
            const message = err.response?.data?.message;
            title = error || message;
            description = error ? message : undefined;
          }
          toast({
            title,
            description,
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top'
          });
        }
        setIsSubmitting(false);
      }
    }
  );

  return (
    <Flex
      as="form"
      flexDir="column"
      onSubmit={handleSubmit((loginDto) => {
        loginMutation.mutate(loginDto);
      })}
      {...props}
    >
      <InputGroup mb={3}>
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
      <InputGroup mb={5}>
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
      <Button type="submit" isLoading={isSubmitting}>
        Login
      </Button>
    </Flex>
  );
};
