import { ReactNode } from "react";

export interface LoadingOverLayProps {
	variant: "transparent" | "overlay";
	loadingMessage?: string;
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
	_id: string;
	name: string;
	rating: number;
	comment: string;
	updatedAt: string;
	createdAt: string;
}

export interface RootState {
	app: {
		theme: string;
	};
	user: {
		userInfo: {
			_id: string;
			name: string;
			email: string;
			isAdmin: boolean;
		};
	};
	summary: {
		dashboard: object;
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
	loading: boolean;
}

export interface ProductListState {
	products: Product[];
	currentProduct: Product;
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

export interface ShippingAddress {
	fullName: string;
	address: string;
	city: string;
	postalCode: string;
	country: string;
	contact: string;
}

export interface OrderItem {
	_id: string;
	product: string;
	qty: number;
	price: number;
	image: string;
	name: string;
}

export interface OrderData {
	_id: string;
	shippingAddress: ShippingAddress;
	orderItems: OrderItem[];
	paymentMethod: string;
	itemsPrice: number;
	shippingPrice: number;
	taxPrice: number;
	totalPrice: number;
	isPaid: boolean;
	isDelivered: boolean;
	paidAt: string;
}

export interface PaymentDetails {
	_id: string;
	status: string;
	update_time: string;
	payer: {
		email_address: string;
	};
}

export interface Order {
	_id: string;
	shippingAddress: ShippingAddress;
	isPaid: boolean;
	isDelivered: boolean;
	orderItems: OrderItem[];
	totalPrice: number;
	createdAt: string;
	paidAt?: string;
	deliveredAt?: string;
}
