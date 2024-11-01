import { CartItem, Product, ProductListState } from "@common/interface";
import { decreaseItemQuantity, increaseItemQuantity, removeItemFromCart } from "@store/cart.slice";
import { setCurrentProduct } from "@store/products.slice";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

const useCartHandling = (onClose: () => void) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const { products } = useSelector(
		(state: { productLists: ProductListState }) => state.productLists,
	);

	const { cart }: { cart: CartItem[] } = useSelector(
		({ cartList }: { cartList: { cart: CartItem[] } }) => cartList,
	);

	const totalPrice = cart.reduce(
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
		onClose()
	};

	const viewCartPage = () => {
		router.push('/store/cart')
		onClose()
	}

	const proceedToCheckout = () => {
		router.push('/store/shipping')
		if (typeof onClose === 'function') {
			onClose()
		}
	}

	return { cart, increaseQuantity, decreaseQuantity, removeItem, viewItem, totalPrice, viewCartPage, proceedToCheckout }
}


export default useCartHandling;