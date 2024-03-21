import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../redux/slice/counterSlice'
import userReducer from '../redux/slice/userSlide'
import productReducer from './slice/productSlide'
import orderReducer from './slice/orderSlice'



export const store = configureStore({
    reducer: {
        counter: counterReducer,
        user: userReducer,
        product: productReducer,
        order: orderReducer
    },
})