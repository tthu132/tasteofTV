import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styles from './OrderSuccess.module.scss'
import classNames from 'classnames/bind';
import { useDispatch, useSelector, } from 'react-redux';
import { Checkbox, Form, Input, Radio } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import Images from '~/components/Images';
import { useEffect, useMemo, useState } from 'react';
import Button from '~/components/Button';
import ModalComponent from "~/components/ModalComponent";
import { useMutationHook } from '~/hooks/useMutationHook';
import Loading from '~/components/Loading';

import * as UserService from '~/services/UserService'
import * as OrderService from '~/services/OrderService'

import * as message from '~/components/Message'
import { updateUser } from '~/redux/slice/userSlide'
import { orderContant } from '~/contant';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder, update } from '~/redux/slice/orderSlice';
import * as CardService from '~/services/CardService'
import images from '~/images';


const cx = classNames.bind(styles)

function OrderSuccess() {
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)
    console.log('bodyy 20', user);
    console.log('bodyy 202', order);
    const dispatch = useDispatch()

    const location = useLocation()
    const { state } = location
    const navigate = useNavigate()
    console.log('location ', location);

    const [searchParams] = useSearchParams()
    const userString = searchParams.get('totalPriceMemo');
    // const getUser = JSON.parse(decodeURIComponent(userString));
    // console.log('bodyy 10 ', getUser);
    const [loadingUser, setLoadingUser] = useState(true)

    const mutationAddOrder = useMutationHook(
        (data) => {
            const {
                token,
                ...rests } = data
            const res = OrderService.createOrder(
                { ...rests }, token)
            return res
        },
    )
    const mutationRemove = useMutationHook(
        (data1) => {
            CardService.deleteCard(data1);
        }
    );
    const { data: dataOrder, isPending: isPendingOrder, isSuccess, isError } = mutationAddOrder

    const test = order?.paymentMethod
    let test2
    const priceMemo = useMemo(() => {
        console.log('momo', order?.orderItemsSlected);
        const result = order?.orderItemsSlected?.reduce((total, cur) => {
            return total + ((cur.price * cur.amount))
        }, 0)
        return result
    }, [order])

    const priceDiscountMemo = useMemo(() => {
        if (!order || !order.orderItemsSlected) {
            return 0;
        }

        return order.orderItemsSlected.reduce((totalDiscount, item) => {
            // Kiểm tra xem trường discount có tồn tại không
            if (item.discount === undefined || item.discount === null) {
                return totalDiscount; // Bỏ qua nếu không có giảm giá
            }

            const totalItemPrice = item.price * item.amount;
            const discountAmount = (totalItemPrice * item.discount) / 100;
            return totalDiscount + discountAmount;
        }, 0);
    }, [order])
    const diliveryPriceMemo = useMemo(() => {
        if (priceMemo >= 200000 && priceMemo < 500000) {
            return 10000
        } else if (priceMemo >= 500000 || order?.orderItemsSlected?.length === 0) {
            return 0
        } else {
            return 20000
        }
    }, [priceMemo])
    const totalPriceMemo = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
    }, [priceMemo, priceDiscountMemo, diliveryPriceMemo])

    useEffect(() => {
        if (user) {
            setLoadingUser(false)
        } else {
            setLoadingUser(true)
        }
        console.log('payment ', test);
        if (test === 'VNPay' && user?.access_token && order?.orderItemsSlected && user?.name
            && user?.address && user?.phone && user?.city && priceMemo && user?.id) {
            console.log('bodyyy', {
                token: user?.access_token,
                orderItems: order?.orderItemsSlected,
                fullName: user?.name,
                address: user?.address,
                phone: user?.phone,
                city: user?.city,
                paymentMethod: order?.paymentMethod,
                itemsPrice: priceMemo,
                shippingPrice: diliveryPriceMemo,
                totalPrice: totalPriceMemo,
                user: user?.id
            });
            mutationAddOrder.mutate(
                {
                    token: user?.access_token,
                    orderItems: order?.orderItemsSlected,
                    fullName: user?.name,
                    address: user?.address,
                    phone: user?.phone,
                    city: user?.city,
                    paymentMethod: order?.paymentMethod,
                    itemsPrice: priceMemo,
                    shippingPrice: diliveryPriceMemo,
                    totalPrice: totalPriceMemo,
                    user: user?.id
                }, {
                onSuccess: () => {
                    test2 = order
                    if (isPendingOrder === false) {
                        test2 = order

                        const arrayOrdered = []
                        order?.orderItemsSlected?.forEach(element => {
                            arrayOrdered.push(element.product)
                        });
                        console.log('arrayOrdered', arrayOrdered);
                        mutationRemove.mutate({ user: user.id, productList: [...arrayOrdered] });
                        dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }))

                        message.success('Đặt hàng thành công')


                        console.log('orderrrr 1', test2);


                    }
                }
            }, {
                onError: () => {
                    message.error('Thanh toán thất bại')
                    navigate('/payment')
                }
            }
            )
        }
    }, [user, userString])

    console.log('orderrrr 2', test2);
    function formatCurrency(number) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    }
    return (
        <div className={cx('wrapper')}>
            <h4><span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Trang chủ</span> - <span onClick={() => navigate('/order')}>Giỏ hàng</span> - <span>Thông tin đơn hàng</span></h4>
            <Loading isLoading={loadingUser}>
                <div className={cx('inner')}>

                    <div className={cx('left')}>
                        {/* <h3>Đặt hàng thành công</h3> */}


                        <h1>Thanh toán thành công</h1>
                        <Images noOrder src={images.pay}></Images>
                        <div className={cx('action')}>
                            <Button btnAdd onClick={() => navigate('/taikhoan/donhang')}>Xem đơn hàng</Button>
                            <Button btnAdd onClick={() => navigate('/taikhoan/order')} >Tiếp tục mua sắm</Button>
                        </div>

                    </div>


                </div>

            </Loading>
        </div>
    );
}

export default OrderSuccess;