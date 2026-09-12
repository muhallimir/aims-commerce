import React from "react";
import { Container } from "@mui/material";
import ProfileForm from "src/forms/ProfileForm";
import { AddressBook } from "src/components/AddressBook";

const Profile: React.FC = () => {
	return (
		<Container maxWidth="sm" sx={{ py: 3 }}>
			<ProfileForm />
			<AddressBook />
		</Container>
	);
};

export default Profile;
