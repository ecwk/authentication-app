import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>({} as T);

  useEffect(() => {
    const storedLocalValue = localStorage.getItem(key);
    if (!storedLocalValue) {
      setStoredValue(defaultValue);
    } else {
      try {
        if (storedLocalValue === 'null' || storedLocalValue === 'undefined') {
          localStorage.removeItem(key);
        } else {
          setStoredValue(JSON.parse(storedLocalValue));
        }
      } catch (err) {
        if (err instanceof SyntaxError) {
          setStoredValue(defaultValue);
        } else {
          console.error(err);
        }
      }
    }
  }, [key, defaultValue]);

  const setValue = (value: T | undefined) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (valueToStore === undefined || valueToStore === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return [storedValue, setValue];
};
