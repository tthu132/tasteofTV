import axios from "axios";
import { axiosJWT } from "./UserService"

export const getAllProductCatogory = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_KEY}/product-category/get-all`)
    return res.data
}

export const createProductCatogory = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/product-category/create`, data)
    return res.data
}

export const updateProductCatogory = async (id, access_token, data) => {
  


    const res = await axiosJWT.put(`${process.env.REACT_APP_API_KEY}/product-category/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
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