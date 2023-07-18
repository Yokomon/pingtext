export const enhanceGoogleImg = (image: string | null) => {
  if (image) {
    return image.replaceAll("s96-c", "s320-c");
  }

  return null;
};
