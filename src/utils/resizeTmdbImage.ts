export const resizeTmdbImage = (imagePath: string, size: string) => {
  console.log('Resizing image:', imagePath, 'to size:', size);
  const newUrl = imagePath.replace(/w(300|500|780|1280)/, size);
  console.log('Resized image URL:', newUrl);
  return newUrl;
};
