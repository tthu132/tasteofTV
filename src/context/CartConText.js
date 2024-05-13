import React, { useContext, useEffect, useState } from "react"

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { addOrderProduct } from '~/redux/slice/orderSlice';
import Loading from '~/components/Loading';
import * as CardService from '~/services/CardService'
import { useMutationHook } from '~/hooks/useMutationHook';
import * as message from '~/components/Message'
import { useLocation, useParams } from 'react-router-dom';
import * as ProductService from '~/services/ProductService'
import { selectedOrder } from '~/redux/slice/orderSlice';
import * as UserService from '~/services/UserService'
import { updateUser, } from '~/redux/slice/userSlide'




export function useCart() {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    // const navigate = useNavigate()
    // const location = useLocation()

    const mutation = useMutationHook(
        (data) => {
            CardService.createCard(data)
        }
    )
    const handleOrderAdd1 = (quality, dataDetail) => {
        console.log('call', {
            name: dataDetail?.name,
            amount: quality,
            image: dataDetail?.firstImage,
            price: dataDetail?.price,
            product: dataDetail?._id,
            countInstock: dataDetail?.countInStock,
            discount: dataDetail?.discount
        });
        if (quality > dataDetail?.countInStock) {
            message.error('Không đủ số lượng! Vui lòng giảm số lượng.')
            return false
            // navigate('/login', { state: location?.pathname })
        } else {

            mutation.mutate({ amount: quality, product: dataDetail?._id, user: user.id })
            dispatch(addOrderProduct({
                orderItem: {
                    name: dataDetail?.name,
                    amount: quality,
                    image: dataDetail?.firstImage,
                    price: dataDetail?.price,
                    product: dataDetail?._id,
                    countInstock: dataDetail?.countInStock,
                    discount: dataDetail?.discount
                }

            }))
            message.success('Đã thêm vào giỏ hàng !!');


        }
        return true

    }
    const handleOrderAdd2 = (quality, dataDetail) => {

        if (quality > dataDetail?.countInStock) {
            message.error('Không đủ số lượng! Vui lòng giảm số lượng.')
            return false
            // navigate('/login', { state: location?.pathname })
        } else {
            dispatch(selectedOrder({
                listChecked: [
                    {
                        name: dataDetail?.name,
                        amount: quality,
                        image: dataDetail?.firstImage,
                        price: dataDetail?.price,
                        product: dataDetail?._id,
                        countInstock: dataDetail?.countInStock,
                        discount: dataDetail?.discount
                    }
                ],
                check: true
            }))



        }
        return true
    }
    const handleSearch = async (value) => {



        const res = await ProductService.searchProduct(value)


        return res.data
    }
    function test(a) {

        alert(a)
    }





    ///////payment

    const [stateUserDetail1, setStateUserdetail] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        address: '',
        city: ''
    })

    const [infoOrder1, setInfoOrder] = useState(false)
    const handleChangeAddress1 = () => {
        setInfoOrder(true)

    }

    const handleOnChangeDetail1 = (e) => {
        setStateUserdetail({
            ...stateUserDetail1,
            [e.target.name]: e.target.value
        })
    }

    const mutationUpdate1 = useMutationHook(
        (data) => {
            const { id,
                token,
                ...rests } = data
            const res = UserService.updateUser(
                id,

                { ...rests }, token,)

            return res
        },
    )
    useEffect(() => {
        if (infoOrder1) {
            setStateUserdetail({
                city: user?.city,
                name: user?.name,
                address: user?.address,
                phone: user?.phone,
                email: user?.email
            })
        }
    }, [infoOrder1])
    const handleOk1 = (user, stateUserDetail1) => {


        const { name, phone, address, city, email } = stateUserDetail1
        if (name && phone && address && city) {
            mutationUpdate1.mutate({ id: user.id, token: user.access_token, ...stateUserDetail1 }, {
                onSuccess: () => {
                    dispatch(updateUser({ id: user.id, token: user.access_token, ...stateUserDetail1 }))
                    setInfoOrder(false)
                }
            });
        }
    }
    return {
        test, handleOrderAdd1, handleSearch, handleOrderAdd2, stateUserDetail1, infoOrder1, handleChangeAddress1, handleOnChangeDetail1, handleOk1, mutationUpdate1
    }
}