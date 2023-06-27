import { useState, useEffect } from "react";

export const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F;

  const [data, setData] = useState<F>(new Set() as F);

  useEffect(() => {
    setData(result);
  }, [result]);

  return data as F;
};
