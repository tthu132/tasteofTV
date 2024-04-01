import axios from "axios";
import { axiosJWT } from "./UserService"


export const createCard = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/card/create`, data)
    return res.data
}

export const getCard = async (id,) => {
    const res = await axios.get(`${process.env.REACT_APP_API_KEY}/card/get/${id}`
    )
    return res.data
}
export const updateCard = async (user, product, newQuantity) => {

    const res = await axios.put(`${process.env.REACT_APP_API_KEY}/card/update`, user, product, newQuantity)
    return res.data
}

export const deleteCard = async ({ user, productList }) => {
    console.log('checkkk', user, productList);
    const res = await axios.delete(`${process.env.REACT_APP_API_KEY}/card/delete-many`, { data: { user, productList } });
    return res.data;
};
export const getDetailsImage = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_KEY}/image/get/${id}`)
    return res.data
}