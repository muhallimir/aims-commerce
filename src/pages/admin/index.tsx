import React from "react";
// import { GetServerSideProps, GetServerSidePropsContext } from "next";
import AdminDashboardLayout from "src/layouts/AdminDashboardLayout";
// import jwt, { JwtPayload } from "jsonwebtoken";

const AdminPage: React.FC = () => {
	return <AdminDashboardLayout />;
};

export default AdminPage;

// interface CustomJwtPayload extends JwtPayload {
// 	isAdmin?: boolean;
// }

// export const getServerSideProps: GetServerSideProps = async (
// 	context: GetServerSidePropsContext
// ) => {
// 	const { req } = context;
// 	const token = req.cookies.token;

// 	if (!token) {
// 		return {
// 			redirect: { destination: "/signin", permanent: false },
// 		};
// 	}

// 	try {
// 		const decoded = jwt.verify(
// 			token,
// 			process.env.JWT_SECRET as string
// 		) as CustomJwtPayload;

// 		if (!decoded?.isAdmin) {
// 			return {
// 				redirect: { destination: "/store", permanent: false },
// 			};
// 		}

// 		return {
// 			props: {},
// 		};
// 	} catch (error) {
// 		console.error("JWT verification failed:", error);
// 		return {
// 			redirect: { destination: "/signin", permanent: false },
// 		};
// 	}
// };
