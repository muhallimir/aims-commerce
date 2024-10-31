import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: [],
};

export const cartSlice = createSlice({
    name: "cartList",
    initialState,
    reducers: {
        updateCartList: (state, action) => {
            const productToAdd = action.payload;
            // Check if the product is already in the cart
            const existingProduct = state.cart.find(product => product._id === productToAdd._id);

            if (existingProduct) {
                // Increment quantity
                existingProduct.quantity += 1;
            } else {
                // Add the new product to the cart
                state.cart.push({ ...productToAdd, quantity: 1 });
            }
        },
        increaseItemQuantity: (state, action) => {
            const itemId = action.payload;
            const existingProduct = state.cart.find(product => product._id === itemId);
            if (existingProduct) {
                existingProduct.quantity += 1;
            }
        },
        decreaseItemQuantity: (state, action) => {
            const itemId = action.payload;
            const existingProduct = state.cart.find(product => product._id === itemId);
            if (existingProduct) {
                // Only decrease quantity if it's greater than 1
                if (existingProduct.quantity > 1) {
                    existingProduct.quantity -= 1;
                }
            }
        },
        removeItemFromCart: (state, action) => {
            const itemId = action.payload;
            // Filter out the item to remove
            state.cart = state.cart.filter(product => product._id !== itemId);
        },
    },
    extraReducers: () => { },
});

// Export actions
export const { updateCartList, increaseItemQuantity, decreaseItemQuantity, removeItemFromCart } = cartSlice.actions;

export default cartSlice.reducer;
