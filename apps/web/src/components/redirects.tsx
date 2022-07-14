import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useAuth } from 'src/modules/auth/hooks';

const PROTECTED_ROUTES = ['/users', '/users/[userid]', '/users/[userid]/edit'];

export const Redirects = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const userHasLoaded = user !== undefined;
    const path = router.pathname;
    if (userHasLoaded) {
      // Protected Routes
      if (!user && PROTECTED_ROUTES.includes(path)) {
        router.push('/login');
      }
      // Don't let users login or register if already logged in
      else if (user && ['/login', '/register'].includes(path)) {
        router.back();
      } else {
        switch (path) {
          case '/users/[userid]/edit': {
            // Users can only edit their own profile
            if (!user || user.id !== router.query.userid) {
              router.back();
            }
            break;
          }
        }
      }
    }
  }, [user, router, router.pathname]);

  return <></>;
};
