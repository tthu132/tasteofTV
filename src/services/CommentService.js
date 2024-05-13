import axios from "axios";
import { axiosJWT } from "./UserService"

export const getAllComment = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_KEY}/comment/getall2/${id}`)
    return res.data
}

export const createComment = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/comment/create`, data)
    return res.data
}

export const updateComment = async (id, data) => {


    const res = await axiosJWT.put(`${process.env.REACT_APP_API_KEY}/comment/update/${id}`, data)
    return res.data
}

export const deleteComment = async (id,) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_KEY}/comment/delete/${id}`)
    return res.data
}
