import {
  Box,
  Button,
  Flex,
  Input,
  BoxProps,
  FlexProps,
  InputProps,
  ButtonProps
} from '@chakra-ui/react';
import { MdPhotoCamera, MdCancel } from 'react-icons/md';
import { useState, useEffect, useRef, ChangeEventHandler } from 'react';

import { ProfileAvatar } from 'src/modules/users/components';
import { User } from 'src/modules/users/types';

type ImageUploadInputProps = {
  user: User | null;
  image: File | null;
  setImage: (image: File | null) => void;
  removeImage: boolean;
  setRemoveImage: (isRemoveImage: boolean) => void;
  containerProps?: FlexProps;
  inputProps?: InputProps;
};

export const ImageUploadInput = ({
  user,
  image,
  setImage,
  removeImage,
  setRemoveImage,
  containerProps,
  inputProps
}: ImageUploadInputProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(
    user?.profile?.profilePicture || null
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [image]);

  const handleImageSelect: ChangeEventHandler<HTMLInputElement> = (e) => {
    const image = e.target.files?.[0];
    setImage(image || null);
    setRemoveImage(false);
  };

  const handleImageRemove = () => {
    setImage(null);
    setImageUrl(null);
    setRemoveImage(true);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Flex {...containerProps}>
      <Box
        position="relative"
        cursor="pointer"
        onClick={() =>
          !removeImage ? handleImageRemove() : inputRef.current?.click()
        }
      >
        <Box
          {...styles.imagePreviewOverlay}
          _hover={{
            '&>svg': {
              ...(!removeImage && { color: '#df0f0f' })
            }
          }}
        >
          {removeImage ? <MdPhotoCamera /> : <MdCancel />}
        </Box>
        <ProfileAvatar
          size="lg"
          name={user?.profile?.name}
          src={imageUrl || undefined}
        />
      </Box>
      <Button
        {...styles.button}
        colorScheme={!removeImage ? 'red' : 'blue'}
        onClick={() =>
          !removeImage ? handleImageRemove() : inputRef.current?.click()
        }
      >
        {!removeImage ? 'REMOVE' : 'CHANGE PHOTO'}
      </Button>
      <Input
        {...inputProps}
        type="file"
        display="none"
        accept=".png,.jpg"
        ref={inputRef}
        onChange={handleImageSelect}
      />
    </Flex>
  );
};

const styles = {
  imagePreviewOverlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 1,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0 ,0 ,0, 0.35)',
    color: 'white',
    width: '100%',
    height: '100%',
    borderRadius: 'lg',
    _hover: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
  } as BoxProps,
  button: {
    ml: 2,
    variant: 'ghost',
    size: 'sm',
    colorScheme: 'gray',
    fontWeight: '400',
    color: '#828282'
  } as ButtonProps
};
