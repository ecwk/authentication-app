import { useColorMode } from '@chakra-ui/react';

import { LogoDark, LogoLight } from 'src/assets';

export const Logo = () => {
  const { colorMode } = useColorMode();

  return colorMode === 'light' ? <LogoDark /> : <LogoLight />;
};
