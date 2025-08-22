export const resizeTmdbImage = (imageUrl: string, size: string) => {
  console.log(`Resizing image: ${imageUrl} to size: ${size}`);
  const newUrl = imageUrl.replace(/w(300|500|780|1280)/, size);
  return newUrl;
};
