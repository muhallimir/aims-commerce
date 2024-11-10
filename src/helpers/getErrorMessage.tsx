export const getErrorMessage = (error: any) => {
	console.log({ error });
	if ("data" in error) {
		return error.data?.message || "An unknown error occurred.";
	} else if ("message" in error) {
		return error.message || "An unknown error occurred.";
	}
	return "An unknown error occurred.";
};
