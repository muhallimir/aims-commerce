import { useSelector } from "react-redux";
import ComingSoon from "src/components/misc/ComingSoon";

const Services: React.FC = () => {
	const theme = useSelector((state: any) => state.app.theme);
	return <ComingSoon darkMode={theme === "dark"} />;
};

export default Services;
