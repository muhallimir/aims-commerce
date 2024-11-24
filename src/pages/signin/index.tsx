import isEmpty from "lodash/isEmpty";
import React, { useEffect } from "react";
import SignInForm from "src/forms/SignInForm";
import useAuthentication from "src/hooks/useAuthentication";

const Signin: React.FC = () => {
	const { userInfo, redirectToHome } = useAuthentication();

	useEffect(() => {
		if (!isEmpty(userInfo)) {
			redirectToHome();
		}
	}, [userInfo]);

	return <SignInForm />;
};

export default Signin;
