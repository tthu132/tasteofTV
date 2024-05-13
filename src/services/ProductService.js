import axios from "axios";
import { axiosJWT } from "./UserService"

export const getAllProduct = async (search, limit) => {
    let res = {}
    if (search?.length > 0) {
        res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/get-all?filter=name&filter=${search}`)
    } else {
        res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/get-all?limit=${limit}`)
    }
    return res.data
}
export const getAllProductByCato = async (search) => {
    let res = {}

    res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/get-all?filter=idProductCategory&filter=${search}`)

    return res.data
}
export const searchProduct = async (data) => {
    console.log('onEvent value search', data);
    const res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/search?q=${data}`)
    return res.data
}

export const createProduct = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/product/create`, data)
    return res.data
}
export const getDetailsProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/get-details/${id}`)
    return res.data
}
export const updateProduct = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_KEY}/product/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteProduct = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_KEY}/product/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
export const getType = async (id,) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_KEY}/product/get-type/${id}`
    )
    return res.data
}