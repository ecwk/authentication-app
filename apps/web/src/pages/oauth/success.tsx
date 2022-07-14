import Head from 'next/head';
import Cookies from 'js-cookie';
import { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Center } from '@chakra-ui/react';

const OAuthSuccess: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = router.query.token as string;
    if (token) {
      const expiresIn = Number(router.query.expiresIn);
      Cookies.set('token', token, {
        expires: new Date(expiresIn)
      });
      window.close();
    }
  }, [router.query]);

  return (
    <Center width="100vw" height="100vh" backgroundColor="black">
      <Head>
        <title>Success</title>
        <meta name="description" content="OAuth success page" />
      </Head>
    </Center>
  );
};

export default OAuthSuccess;
