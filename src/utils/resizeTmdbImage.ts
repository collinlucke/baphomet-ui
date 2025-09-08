export const resizeTmdbImage = (imageUrl: string, size: string) => {
  const newUrl = imageUrl.replace(/w(300|500|780|1280)/, size);
  return newUrl;
};
