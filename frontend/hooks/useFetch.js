import { useState, useEffect } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadData() {
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    }

    if (url) loadData();
  }, [url]);

  return { data };
}
// importacao do usefetch para ser usado em outros componentes, ele recebe uma url e retorna os dados da api, usando o useState para armazenar os dados e o useEffect para fazer a requisição quando a url mudar.