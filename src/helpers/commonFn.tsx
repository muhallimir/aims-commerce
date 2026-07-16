export const getImageUrl = (image: string) => {
	if (!image) return "";
	return image.startsWith("/uploads") ? image : image;
};
