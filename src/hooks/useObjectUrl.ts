import { useEffect, useRef, useState } from 'react';

export function useObjectUrl(blob: Blob | null): string | null {
  const [url, setUrl] = useState<string | null>(null);
  const prevUrl = useRef<string | null>(null);

  useEffect(() => {
    if (blob == null) {
      if (prevUrl.current) {
        URL.revokeObjectURL(prevUrl.current);
        prevUrl.current = null;
      }
      setUrl(null);
      return () => {};
    }
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    const old = prevUrl.current;
    prevUrl.current = objectUrl;
    if (old) URL.revokeObjectURL(old);
    return () => {
      if (prevUrl.current) {
        URL.revokeObjectURL(prevUrl.current);
        prevUrl.current = null;
      }
    };
  }, [blob]);

  return url;
}


