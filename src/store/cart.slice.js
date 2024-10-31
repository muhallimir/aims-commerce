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
                // Optionally update the existing product's quantity if needed
                existingProduct.quantity = (existingProduct.quantity || 1) + 1; // Increment quantity
            } else {
                // Add the new product to the cart
                state.cart.push({ ...productToAdd, quantity: 1 });
            }
        },
    },
    extraReducers: () => { },
});

export const { updateCartList } = cartSlice.actions;

export default cartSlice.reducer;
