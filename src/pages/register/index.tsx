import isEmpty from "lodash/isEmpty";
import React, { useEffect } from "react";
import RegistrationForm from "src/forms/RegistrationForm";
import useAuthentication from "src/hooks/useAuthentication";

const Register: React.FC = () => {
	const { userInfo, redirectToHome } = useAuthentication();

	useEffect(() => {
		if (!isEmpty(userInfo)) {
			redirectToHome();
		}
	}, [userInfo]);

	return <RegistrationForm />;
};

export default Register;
