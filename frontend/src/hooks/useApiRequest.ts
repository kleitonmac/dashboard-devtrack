import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';

/**
 * Hook customizado para requisições de API com tratamento de erros
 * @param {string} initialEndpoint - URL inicial da API
 * @returns {object} - { data, loading, error, executeRequest, resetError }
 */
export const useApiRequest = (initialEndpoint = '') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeRequest = useCallback(
    async (method = 'GET', endpoint = initialEndpoint, requestData = null) => {
      setLoading(true);
      setError(null);

      try {
        const config = {};
        let response;

        switch (method.toUpperCase()) {
          case 'GET':
            response = await api.get(endpoint, config);
            break;
          case 'POST':
            response = await api.post(endpoint, requestData, config);
            break;
          case 'PUT':
            response = await api.put(endpoint, requestData, config);
            break;
          case 'PATCH':
            response = await api.patch(endpoint, requestData, config);
            break;
          case 'DELETE':
            response = await api.delete(endpoint, config);
            break;
          default:
            throw new Error(`Método HTTP não suportado: ${method}`);
        }

        setData(response.data);
        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Erro na requisição';
        
        setError(errorMessage);
        console.error(`[API Error] ${method} ${endpoint}:`, errorMessage);
        
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [initialEndpoint]
  );

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    executeRequest,
    resetError,
  };
};

/**
 * Hook para fetch genérico com suporte a parâmetros
 * @param {string} endpoint - URL da API
 * @param {object} options - Opções (method, data, skip, dependencies)
 */
export const useFetch = (endpoint, options = {}) => {
  const {
    method = 'GET',
    data = null,
    skip = false,
    dependencies = [],
  } = options;

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (skip) return;

    setLoading(true);
    setError(null);

    try {
      let result;
      if (method === 'GET') {
        result = await api.get(endpoint);
      } else if (method === 'POST') {
        result = await api.post(endpoint, data);
      } else if (method === 'PUT') {
        result = await api.put(endpoint, data);
      } else if (method === 'DELETE') {
        result = await api.delete(endpoint);
      }
      setResponse(result.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message;
      setError(errorMessage);
      console.error(`[Fetch Error] ${method} ${endpoint}`, errorMessage);
    } finally {
      setLoading(false);
    }
  }, [endpoint, method, data, skip]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { response, loading, error, refetch: fetchData };
};
