export const getCleanImageUrl = (url: string): string => {
  if (!url) return "";
  const queryIdx = url.indexOf("?");
  if (queryIdx === -1) return url;
  return url.substring(0, queryIdx);
};

export const getAdjustmentValue = (url: string, param: string, defaultValue: string): string => {
  if (!url) return defaultValue;
  const queryIdx = url.indexOf("?");
  if (queryIdx === -1) return defaultValue;
  const params = new URLSearchParams(url.substring(queryIdx));
  return params.get(param) || defaultValue;
};

export const setAdjustmentValue = (url: string, param: string, value: string): string => {
  if (!url) return "";
  const queryIdx = url.indexOf("?");
  let baseUrl = url;
  let params = new URLSearchParams();
  if (queryIdx !== -1) {
    baseUrl = url.substring(0, queryIdx);
    params = new URLSearchParams(url.substring(queryIdx));
  }
  params.set(param, value);
  return `${baseUrl}?${params.toString()}`;
};

export const getImageStyle = (url: string): React.CSSProperties => {
  if (!url) return {};
  const scale = getAdjustmentValue(url, "scale", "1");
  const x = getAdjustmentValue(url, "x", "0");
  const y = getAdjustmentValue(url, "y", "0");
  const rot = getAdjustmentValue(url, "rot", "0");
  const fit = getAdjustmentValue(url, "fit", "cover");
  const filter = getAdjustmentValue(url, "filter", "none");
  
  let filterValue = "none";
  if (filter === "grayscale") filterValue = "grayscale(1)";
  if (filter === "neon") filterValue = "hue-rotate(90deg) saturate(1.5) contrast(1.2)";
  if (filter === "warm") filterValue = "sepia(0.4) saturate(1.2)";
  
  return {
    transform: `scale(${scale}) translate(${x}px, ${y}px) rotate(${rot}deg)`,
    objectFit: fit as any,
    filter: filterValue,
    transition: "all 0.15s ease-out"
  };
};
