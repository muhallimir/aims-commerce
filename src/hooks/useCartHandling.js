import { decreaseItemQuantity, increaseItemQuantity, removeItemFromCart, setIsCheckingOut } from "@store/cart.slice";
import { setCurrentProduct } from "@store/products.slice";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import useAuthentication from "./useAuthentication";
import { isEmpty } from "lodash";

const useCartHandling = (onClose) => {
	const { isAuthenticated } = useAuthentication();
	const dispatch = useDispatch();
	const router = useRouter();
	const { products } = useSelector(({ productLists }) => productLists)

	const { cartItems, shippingAddress, paymentMethod } = useSelector(({ cart }) => cart);

	const totalPrice = cartItems.reduce(
		(total, item) => total + item.price * item.quantity,
		0,
	);

	const increaseQuantity = (itemId) => {
		dispatch(increaseItemQuantity(itemId));
	};

	const decreaseQuantity = (itemId) => {
		dispatch(decreaseItemQuantity(itemId));
	};

	const removeItem = (itemId) => {
		dispatch(removeItemFromCart(itemId));
	};

	const viewItem = (itemId) => {
		const currentProduct =
			products.find((p) => p?._id === itemId) || null;
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

	return { cartItems, shippingAddress, paymentMethod, increaseQuantity, decreaseQuantity, removeItem, viewItem, totalPrice, viewCartPage, proceedToCheckout };
}

export default useCartHandling;
