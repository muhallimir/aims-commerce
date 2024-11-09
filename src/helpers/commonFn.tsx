export const getImageUrl = (image: string) => {
	return image?.startsWith("/uploads")
		? `${process.env.NEXT_PUBLIC_MONGODB_URI}${image}`
		: image;
};
