import { CartItem, Product, ProductListState, ShippingFormValues } from "@common/interface";
import { decreaseItemQuantity, increaseItemQuantity, removeItemFromCart, setIsCheckingOut } from "@store/cart.slice";
import { setCurrentProduct } from "@store/products.slice";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import useAuthentication from "./useAuthentication";
import { isEmpty } from "lodash";

interface CartState {
	cartItems: CartItem[];
	shippingAddress: ShippingFormValues;
	isCheckingOut: boolean;
}

const useCartHandling = (onClose?: () => void) => {
	const { isAuthenticated } = useAuthentication();
	const dispatch = useDispatch();
	const router = useRouter();
	const { products } = useSelector(
		(state: { productLists: ProductListState }) => state.productLists,
	);

	const { cartItems, shippingAddress }: CartState = useSelector(
		({ cart }: { cart: CartState }) => cart,
	);

	const totalPrice = cartItems.reduce(
		(total, item) => total + item.price * item.quantity,
		0,
	);

	const increaseQuantity = (itemId: string) => {
		dispatch(increaseItemQuantity(itemId));
	};

	const decreaseQuantity = (itemId: string) => {
		dispatch(decreaseItemQuantity(itemId));
	};

	const removeItem = (itemId: string) => {
		dispatch(removeItemFromCart(itemId));
	};

	const viewItem = (itemId: string) => {
		const currentProduct =
			products.find((p: Product) => p?._id === itemId) || null;
		dispatch(setCurrentProduct(currentProduct));
		router.push(`/store/product/${itemId}`);
		if (typeof onClose === 'function') {
			onClose();
		}
	};

	const viewCartPage = () => {
		router.push('/store/cart');
		onClose?.();
	};

	const proceedToCheckout = () => {
		const targetRoute = isAuthenticated
			? (isEmpty(cartItems) ? '/store/cart' : '/store/shipping')
			: '/signin';

		router.push(targetRoute);
		if (!isEmpty(cartItems)) {
			dispatch(setIsCheckingOut(true));
		}
		onClose?.();
	};

	return { cartItems, shippingAddress, increaseQuantity, decreaseQuantity, removeItem, viewItem, totalPrice, viewCartPage, proceedToCheckout };
}

export default useCartHandling;
