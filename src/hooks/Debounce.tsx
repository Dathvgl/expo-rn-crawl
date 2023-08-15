import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number = 500) {
  const [state, setState] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setState(value), delay);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return state;
}

export default useDebounce;
