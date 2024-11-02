import { useRouter } from "next/router";
import { ReactNode } from "react";

export interface LoadingOverLayProps {
	loadingMessage: string;
	variant: string;
}
export interface MainLayoutProps {
	children: ReactNode;
}

export interface Product {
	_id: string;
	name: string;
	category: string;
	brand: string;
	price: number;
	description: string;
	rating: number;
	numReviews: number;
	image: string;
	countInStock: number;
	reviews: Review[];
}

export interface Review {
	name: string;
	rating: number;
	comment: string;
}

export interface RootState {
	app: {
		theme: string;
	};
	user: {
		userInfo: any;
	};
}

export interface ProductCTAProps {
	variant?: "text" | "outlined" | "contained";
	color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
	onClick?: () => void;
	buttonText: string;
	disabled?: boolean;
	sx?: { [key: string]: any };
}

export interface CardsContentProps {
	product: Product;
	theme: any;
	isMobile: boolean;
}

export interface ProductCardProps {
	product: Product;
}

export interface AppState {
	theme: string;
}

export interface ProductListState {
	products: Product[];
}

export interface ProductCardSkeletonProps {
	darkMode: boolean;
	isMobile: boolean;
}

export interface ComingSoonProps {
	darkMode: boolean;
}

export interface CartItem {
	_id: string;
	name: string;
	image: string;
	price: number;
	quantity: number;
}

export interface CartDrawerProps {
	open: boolean;
	onClose: () => void;
}

export interface SignInProps {
	isDarkMode: boolean;
}

export interface ShippingFormValues {
	fullName: string;
	contactNo: string;
	address: string;
	city: string;
	postalCode: string;
	country: string;
}

export interface SignInFormValues {
	email: string;
	password: string;
}

export interface RegistrationFormValues {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}
