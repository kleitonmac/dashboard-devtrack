import { useState } from 'react';

export function useFetch(asyncFunction, immediate = true) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = async (...args) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await asyncFunction(...args);
      setData(result.data);
      return result.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, execute };
}

export default useFetch;
