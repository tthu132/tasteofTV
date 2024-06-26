import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: '',
    email: '',
    access_token: '',
    phone: '',
    id: '',
    avatar: '',
    isAdmin: false,
    address: '',
    tinh: '',
    huyen: '',
    xa: '',
    detailAddress: ''
}

export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { name = '', email = '', access_token = '', address = '', phone = '', avatar = '', _id = '', isAdmin, city = '', refreshToken = '', tinh = '', huyen = '', xa = '', detailAddress = '' } = action.payload

            const newAddress = [detailAddress, xa, huyen, tinh].filter(Boolean).join(', ');

            // Cập nhật state với giá trị mới của address
            state.address = newAddress;

            state.name = name ? name : state.name;
            state.email = email ? email : state.email;
            // state.address = address ? address : state.address;
            state.phone = phone ? phone : state.phone;
            state.avatar = avatar ? avatar : state.avatar;
            state.id = _id ? _id : state.id
            state.access_token = access_token ? access_token : state.access_token;
            state.isAdmin = isAdmin ? isAdmin : state.isAdmin;
            state.tinh = tinh ? tinh : state.tinh;
            state.huyen = huyen ? huyen : state.huyen;
            state.xa = xa ? xa : state.xa;
            state.detailAddress = detailAddress ? detailAddress : state.detailAddress;
            state.refreshToken = refreshToken ? refreshToken : state.refreshToken;
        },
        resetUser: (state) => {
            state.name = '';
            state.email = '';
            state.address = '';
            state.phone = '';
            state.avatar = '';
            state.id = '';
            state.access_token = '';
            state.isAdmin = false;
            state.tinh = '';
            state.huyen = '';
            state.xa = '';
            state.detailAddress = '';
            state.refreshToken = ''
        },


    },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlide.actions

export default userSlide.reducer