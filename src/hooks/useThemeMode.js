import { switchTheme } from "@store/app.slice";
import { useDispatch, useSelector } from "react-redux";

const useThemeMode = () => {
	const { theme } = useSelector(({ app }) => app);
	const dispatch = useDispatch();
	const toggleTheme = () => {
		dispatch(switchTheme(theme === "dark" ? "light" : "dark"));
	};
	const isDarkMode = theme === "dark";

	return { isDarkMode, toggleTheme };
};

export default useThemeMode;
