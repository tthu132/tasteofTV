import { axiosJWT } from "./UserService"
import axios from "axios";

// export const createProduct = async (data) => {
//   const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, data)
//   return res.data
// // }
// http://localhost:3001/api/order/get-order-details/639724669c6dda4fa11edcde
export const createOrder = async (data, access_token) => {
    console.log('body data ', data);
    console.log('body acc ', access_token);


    const res = await axiosJWT.post(`${process.env.REACT_APP_API_KEY}/order/create/${data.user}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getOrderByUserId = async (id, access_token) => {
    console.log('tokuuu ', access_token);
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_KEY}/order/get-all-order/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getDetailsOrder = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_KEY}/order/get-details-order/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const cancelOrder = async (id, access_token, orderItems, userId) => {
    const data = { orderItems, orderId: id }
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_KEY}/order/cancel-order/${userId}`, { data }, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getAllOrder = async (access_token) => {
    console.log('accesssss ', access_token);
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_KEY}/order/get-all-order`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
export const getOrdersByUserAndStatus = async (userId, status) => {
    console.log('location 3 ', userId, status);
    const res = await axios.get(`${process.env.REACT_APP_API_KEY}/order/get-order/${userId}?status=${encodeURIComponent(status)}`)
    return res.data
}
export const updateOrder = async (id, data) => {
    console.log('location 3 ', id, data);
    const res = await axios.put(`${process.env.REACT_APP_API_KEY}/order/update/${id}`, data)
    return res.data
}

///payment_vnpay_url
// export const addOrderByVNPay = async (access_token) => {
//     const res = await axiosJWT.get(`${process.env.REACT_APP_API_KEY}/order/payment_vnpay_url`, { totalPrice }, {
//         headers: {
//             token: `Bearer ${access_token}`,
//         }
//     })
//     window.location.href = res.data.vnpUrl;
//     // return res.data
// }




// const addOrderVNPay = async () => {
//     try {
//       const res = await axios.post(
//         `${BASE_URL}/booking/payment_vnpay_url`,
//         { totalAmount, surcharge },
//         {
//           headers: {
//             Authorization: "Bearer " + token,
//           },
//         },
//       );

//       window.location.href = res.data.vnpUrl;
//       return true;
//     } catch (error) {
//       return false;
//     }
//   };