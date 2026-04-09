import React, { useCallback, useEffect, useRef } from "react";

const useLatest = (defaultValue) => {
  const ref = useRef(defaultValue);

  const updateRef = useCallback((newValue) => {
    ref.current = newValue;
  }, []);

  useEffect(() => {
    updateRef(defaultValue);
  }, [defaultValue, updateRef]);

  return ref;
};

export default useLatest;
