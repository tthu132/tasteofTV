import axios from "axios";
import { axiosJWT } from "./UserService"

export const getAllProductCatogory = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_KEY}/blog/get-all`)
    return res.data
}

export const createProductCatogory = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/blog/create`, data)
    return res.data
}

export const updateProductCatogory = async (id, data) => {
    console.log('check ', id);


    const res = await axiosJWT.put(`${process.env.REACT_APP_API_KEY}/blog/update/${id}`, data)
    return res.data
}

export const deleteProductCatogory = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_KEY}/product-category/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
export const getDetailsOrder = async (id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_KEY}/blog/get/${id}`)
    return res.data
}