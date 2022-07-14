import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { IconButton, IconButtonProps, useColorMode } from '@chakra-ui/react';

type DarkModeButtonProps = Partial<IconButtonProps> & {};

export const DarkModeButton = (props: DarkModeButtonProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      {...props}
      aria-label="Toggle dark mode"
      variant="outline"
      colorScheme="gray"
      icon={
        colorMode === 'light' ? <MdOutlineLightMode /> : <MdOutlineDarkMode />
      }
      onClick={() => toggleColorMode()}
    />
  );
};
