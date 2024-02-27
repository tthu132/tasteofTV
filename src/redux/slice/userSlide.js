import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: '',
    email: '',
    access_token: '',
    phone: '',
    id: '',
    avatar: '',
    isAdmin: false
}

export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {

            const { name, email, access_token, phone, _id, avatar, isAdmin } = action.payload
            state.name = name || email;
            state.email = email;
            state.phone = phone;
            state.id = _id;
            state.avatar = avatar;
            state.isAdmin = isAdmin;
            state.access_token = access_token

        },
        resetUser: (state) => {


            state.name = '';
            state.email = '';
            state.phone = '';
            state.id = ''
            state.access_token = '';
            state.avatar = ''

        }

    },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlide.actions

export default userSlide.reducer