import React from "react";
import { Container } from "@mui/material";
import ProfileForm from "src/forms/ProfileForm";
import { AddressBook } from "src/components/AddressBook";
import { NotificationPrefs } from "src/components/NotificationPrefs";

const Profile: React.FC = () => {
	return (
		<Container maxWidth="sm" sx={{ py: 3 }}>
			<ProfileForm />
			<AddressBook />
			<NotificationPrefs />
		</Container>
	);
};

export default Profile;
