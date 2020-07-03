// https://github.com/the-road-to-learn-react/react-local-storage
// wraps the LocalStorage API with JSON.parse and stringify calls
import { useEffect, useState } from 'react';

const useObjectWithLocalStorage = (localStorageKey) => {
  const [value, setValue] = useState(() => {
    const obj = localStorage.getItem(localStorageKey);
    if (!obj) return null;
    return JSON.parse(obj);
  });

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return [value, setValue];
};

export default useObjectWithLocalStorage;
