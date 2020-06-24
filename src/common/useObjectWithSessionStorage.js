// https://github.com/the-road-to-learn-react/react-local-storage
// wraps the SessionStorage API with JSON.parse and stringify calls
import { useEffect, useState } from 'react';

const useObjectWithSessionStorage = (sessionStorageKey) => {
  const [value, setValue] = useState(() => {
    const obj = sessionStorage.getItem(sessionStorageKey);
    if (!obj) return null;
    return JSON.parse(obj);
  });

  useEffect(() => {
    sessionStorage.setItem(sessionStorageKey, JSON.stringify(value));
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return [value, setValue];
};

export default useObjectWithSessionStorage;
