import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdExitToApp,
  MdAccountCircle,
  MdGroup
} from 'react-icons/md';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  HStack,
  Flex,
  Spacer,
  Link,
  Button,
  useColorModeValue,
  useBreakpoint,
  useColorMode
} from '@chakra-ui/react';
import { useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { MdOutlineDarkMode, MdOutlineLightMode, MdHome } from 'react-icons/md';

import { ProfileAvatar } from 'src/modules/users/components';
import { DarkModeButton } from './dark-mode-button';
import { useAuth } from 'src/modules/auth/hooks';
import { Logo } from './logo';

const HIDDEN_PATHS = ['/oauth/success'];
const LINKS: { name: string; href: string; protected_?: boolean }[] = [
  {
    name: 'Home',
    href: '/'
  },
  {
    name: 'Users',
    href: '/users',
    protected_: true
  }
];

export const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const breakpoint = useBreakpoint();
  const linkColor = useColorModeValue('gray.700', 'gray.200');

  const isHidden = HIDDEN_PATHS.includes(router.pathname);
  if (isHidden) {
    return <></>;
  }

  return (
    <Flex
      as="nav"
      my={8}
      px={8}
      mx="auto"
      maxW="1500px"
      h="40px"
      alignItems="center"
    >
      {['base', 'sm'].includes(breakpoint) ? (
        <MobileNavbar user={user} logout={logout} linkColor={linkColor} />
      ) : (
        <DesktopNavbar user={user} logout={logout} linkColor={linkColor} />
      )}
    </Flex>
  );
};

const MobileNavbar = ({ user, logout, linkColor }: Record<string, any>) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <HStack spacing={5} color={linkColor}>
        <NextLink href="/" passHref>
          <Link alignItems="center" display="flex" mt={1}>
            <Logo />
          </Link>
        </NextLink>
      </HStack>
      <Spacer />
      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton
              as={Button}
              variant="ghost"
              colorScheme="gray"
              fontSize="12px"
              fontWeight="700"
            >
              <Flex alignItems="center" gap={2}>
                <ProfileAvatar user={user} size="sm" />
              </Flex>
            </MenuButton>
            <MenuList p={3} borderRadius="2xl">
              {LINKS.map(({ name, href, protected_ }) => (
                <NextLink href={href} key={`${name}-${href}-mobile`} passHref>
                  <MenuItem
                    hidden={protected_ && !user}
                    borderRadius="xl"
                    minH="45px"
                  >
                    {name}
                  </MenuItem>
                </NextLink>
              ))}
              <MenuDivider />
              {user ? (
                <>
                  {' '}
                  <NextLink href={`/users/${user?.id}`}>
                    <MenuItem
                      borderRadius="xl"
                      minH="45px"
                      icon={<MdAccountCircle size="20px" />}
                    >
                      Profile
                    </MenuItem>
                  </NextLink>
                  <MenuItem
                    borderRadius="xl"
                    minH="45px"
                    icon={<MdGroup size="20px" />}
                  >
                    Group Chat
                  </MenuItem>
                </>
              ) : (
                <>
                  <NextLink href={`/login`}>
                    <MenuItem borderRadius="xl" minH="45px">
                      Log In
                    </MenuItem>
                  </NextLink>
                  <NextLink href={`/register`}>
                    <MenuItem borderRadius="xl" minH="45px">
                      Register
                    </MenuItem>
                  </NextLink>
                </>
              )}
              <MenuDivider />
              <MenuItem
                borderRadius="xl"
                minH="45px"
                onClick={() => toggleColorMode()}
                icon={
                  colorMode === 'light' ? (
                    <MdOutlineLightMode size="20px" />
                  ) : (
                    <MdOutlineDarkMode size="20px" />
                  )
                }
              >
                Toggle {colorMode === 'dark' ? 'Dark' : 'Light'}
              </MenuItem>
              <MenuItem
                borderRadius="xl"
                minH="45px"
                icon={<MdExitToApp size="20px" />}
                onClick={() => {
                  logout();
                }}
                fontWeight="500"
                color="#EB5757"
                _hover={{
                  backgroundColor: '#eb575726'
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </>
        )}
      </Menu>
    </>
  );
};

const DesktopNavbar = ({ user, logout, linkColor }: Record<string, any>) => {
  return (
    <>
      <HStack spacing={5} color={linkColor}>
        <NextLink href="/" passHref>
          <Link alignItems="center" display="flex" mt={1}>
            <Logo />
          </Link>
        </NextLink>
        {LINKS.map(({ name, href, protected_ }) => (
          <NextLink key={`${name}-${href}-desktop`} href={href} passHref>
            <Link hidden={protected_ && !user}>{name}</Link>
          </NextLink>
        ))}
      </HStack>
      <Spacer />
      <DarkModeButton mr={4} />
      {user ? (
        <Menu offset={[-55, 25]}>
          {({ isOpen }) => (
            <>
              <MenuButton
                as={Button}
                variant="ghost"
                colorScheme="gray"
                fontSize="12px"
                fontWeight="700"
              >
                <Flex alignItems="center" gap={2}>
                  <ProfileAvatar user={user} size="sm" />
                  <Text as="span" ml={2} mr={1} verticalAlign="middle">
                    {user?.profile?.name || user?.email}
                  </Text>
                  {isOpen ? <MdArrowDropUp /> : <MdArrowDropDown />}
                </Flex>
              </MenuButton>
              <MenuList p={3} borderRadius="2xl">
                <NextLink href={`/users/${user?.id}`}>
                  <MenuItem
                    borderRadius="xl"
                    minH="45px"
                    icon={<MdAccountCircle size="20px" />}
                  >
                    Profile
                  </MenuItem>
                </NextLink>
                <MenuItem
                  borderRadius="xl"
                  minH="45px"
                  icon={<MdGroup size="20px" />}
                >
                  Group Chat
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  borderRadius="xl"
                  minH="45px"
                  icon={<MdExitToApp size="20px" />}
                  onClick={() => {
                    logout();
                  }}
                  fontWeight="500"
                  color="#EB5757"
                  _hover={{
                    backgroundColor: '#eb575726'
                  }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </>
          )}
        </Menu>
      ) : (
        <HStack spacing={4}>
          <NextLink href="/login">
            <Button variant="outline">Log In</Button>
          </NextLink>
          <NextLink href="/register">
            <Button>Get Started</Button>
          </NextLink>
        </HStack>
      )}
    </>
  );
};
