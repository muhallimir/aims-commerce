export const getImageUrl = (image: string) => {
	return image?.startsWith("/uploads")
		? `${process.env.NEXT_PUBLIC_API_URI}${image}`
		: image;
};
