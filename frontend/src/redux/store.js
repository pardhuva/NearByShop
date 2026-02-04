import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import shopReducer from './slices/shopSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    shops: shopReducer,
  },
});

export default store;
