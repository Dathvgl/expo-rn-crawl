import { useEffect, useState } from "react";
import { Image } from "react-native";

export default function useImageAspectRatio(url: string) {
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    if (!url) return;

    let isValid = true;
    Image.getSize(url, (width, height) => {
      if (isValid) setAspectRatio(width / height);
    });

    return () => {
      isValid = false;
    };
  }, [url]);

  return aspectRatio;
}
