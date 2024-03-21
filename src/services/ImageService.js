import axios from "axios";
import { axiosJWT } from "./UserService"

export const getAllImage = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_KEY}/image/get-all`)
    return res.data
}

export const createImage = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/image/create`, data)
    return res.data
}

export const updateImage = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_KEY}/image/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteImage = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_KEY}/image/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
export const getDetailsImage = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_KEY}/image/get/${id}`)
    return res.data
}