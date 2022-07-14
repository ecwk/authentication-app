import { useState } from 'react';
import Cookies, { CookieAttributes } from 'js-cookie';

export const useCookie = <T>(
  key: string,
  defaultValue: T | undefined = undefined
): [T, (value: T | undefined, options?: CookieAttributes) => void] => {
  const [cookieValue, setCookieValue] = useState<T>(() => {
    const storedCookieValue = Cookies.get(key);
    if (!storedCookieValue) {
      Cookies.remove(key);
      return defaultValue;
    }
    try {
      return JSON.parse(storedCookieValue);
    } catch (error) {
      if (error instanceof SyntaxError) {
        // The stored value is a string, so we can't parse it as JSON.
        return storedCookieValue;
      } else {
        console.error(error);
      }
      return defaultValue;
    }
  });

  const setValue = (value: T | undefined, options?: CookieAttributes) => {
    try {
      const valueToStore =
        value instanceof Function ? value(cookieValue) : value;
      setCookieValue(valueToStore);
      if (!valueToStore) {
        Cookies.remove(key);
      } else {
        Cookies.set(
          key,
          typeof valueToStore === 'string'
            ? valueToStore
            : JSON.stringify(valueToStore),
          options
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return [cookieValue, setValue];
};
