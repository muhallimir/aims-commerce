import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
    shippingAddress: [],
    paymentMethod: null,
    isCheckingOut: false,
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        updateCartList: (state, action) => {
            const productToAdd = action.payload;
            // Check if the product is already in the cart
            const existingProduct = state.cartItems.find(product => product._id === productToAdd._id);

            if (existingProduct) {
                // Increment quantity
                existingProduct.quantity += 1;
            } else {
                // Add the new product to the cart
                state.cartItems.push({ ...productToAdd, quantity: 1 });
            }
        },
        increaseItemQuantity: (state, action) => {
            const itemId = action.payload;
            const existingProduct = state.cartItems.find(product => product._id === itemId);
            if (existingProduct) {
                existingProduct.quantity += 1;
            }
        },
        decreaseItemQuantity: (state, action) => {
            const itemId = action.payload;
            const existingProduct = state.cartItems.find(product => product._id === itemId);
            if (existingProduct) {
                if (existingProduct.quantity > 1) {
                    existingProduct.quantity -= 1;
                }
            }
        },
        removeItemFromCart: (state, action) => {
            const itemId = action.payload;
            state.cartItems = state.cartItems.filter(product => product._id !== itemId);
        },
        resetCartState: () => {
            return initialState;
        },
        setIsCheckingOut: (state, action) => {
            state.isCheckingOut = action.payload;
        },
        updateShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
        },
        updatePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
        }
    },
    extraReducers: () => { },
});

export const { updateCartList, increaseItemQuantity, decreaseItemQuantity, removeItemFromCart, resetCartState, setIsCheckingOut, updateShippingAddress, updatePaymentMethod } = cartSlice.actions;

export default cartSlice.reducer;
