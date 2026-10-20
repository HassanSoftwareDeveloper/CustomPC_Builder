import { useState } from "react";

function ProductImage({ src, alt, className = "", loading = "lazy" }) {
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) {
    return (
      <div
        className={`flex items-center justify-center bg-bg text-sm text-muted ${className}`}
      >
        No photo
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailedSrc(src)}
      loading={loading}
      className={`object-cover ${className}`}
    />
  );
}

export default ProductImage;
