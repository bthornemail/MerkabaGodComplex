/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect } from "react";


export function useDebounce(callback, delay) {
    const timeoutRef = useRef<any>(null);
  
    const debouncedFunction = (...args) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  
    useEffect(() => {
      return () => clearTimeout(timeoutRef.current);
    }, []);
  
    return debouncedFunction;
  }