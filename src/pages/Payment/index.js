import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Payment.module.scss'
import classNames from 'classnames/bind';
import { useDispatch, useSelector, } from 'react-redux';
import { Checkbox, Form, Input, Radio } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import Images from '~/components/Images';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder, update } from '~/redux/slice/orderSlice';
import { useEffect, useMemo, useState } from 'react';
import Button from '~/components/Button';
import ModalComponent from "~/components/ModalComponent";
import { useMutationHook } from '~/hooks/useMutationHook';
import Loading from '~/components/Loading';

import * as UserService from '~/services/UserService'
import * as OrderService from '~/services/OrderService'

import * as message from '~/components/Message'
import { updateUser, } from '~/redux/slice/userSlide'
import * as CardService from '~/services/CardService'
import axios from "axios";

import { axiosJWT } from "~/services/UserService"


const { TextArea } = Input;

const cx = classNames.bind(styles)

function Payment() {
    const navigate = useNavigate()
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)


    // const { token } = useSelector((state) => state.user.access_token);
    const [value, setValue] = useState('');

    const dispatch = useDispatch()

    const priceMemo = useMemo(() => {
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

    function formatCurrency(number) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    }
    //=====================================================

    const [form1] = Form.useForm();
    const [infoOrder, setInfoOrder] = useState(false)
    const [stateUserDetail, setStateUserdetail] = useState({
        name: '',

        phone: '',
        isAdmin: false,
        address: '',
        detailAddress: '',
        tinh: '',
        huyen: '',
        xa: ''

    })
    useEffect(() => {
        if (infoOrder) {
            setStateUserdetail({

                name: user?.name,
                address: user?.address,
                phone: user?.phone,
                detailAddress: user?.detailAddress,
                tinh: user?.tinh,
                huyen: user?.huyen,
                xa: user?.xa
            })
        }
    }, [infoOrder])
    useEffect(() => {
        form1.setFieldsValue(stateUserDetail)
    }, [form1, stateUserDetail])
    const handleOnChangeDetail = (e) => {
        setStateUserdetail({
            ...stateUserDetail,
            [e.target.name]: e.target.value
        })
    }
    const mutationUpdate = useMutationHook(
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
    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated, isPending: isLoadingUpdated } = mutationUpdate
    const onFinishUpdate = () => {
        const { name, phone, tinh, huyen, xa, detailAddress } = stateUserDetail
        if (name && phone) {
            mutationUpdate.mutate({ id: user.id, token: user.access_token, ...stateUserDetail }, {
                onSuccess: () => {
                    dispatch(updateUser({ id: user.id, token: user.access_token, ...stateUserDetail }))
                    setInfoOrder(false)
                }
            });
        }
    }
    const onFinishFailed = () => {

    }
    const handleOk = () => {

        onFinishUpdate()
        onFinishFailed()
        const { name, phone, tinh, huyen, xa, detailAddress } = stateUserDetail
        if (name && phone) {
            mutationUpdate.mutate({ id: user.id, token: user.access_token, ...stateUserDetail }, {
                onSuccess: () => {
                    dispatch(updateUser({ id: user.id, token: user.access_token, ...stateUserDetail }))
                    setInfoOrder(false)
                }
            });
        }
    }
    const handleCancleUpdate = () => {
        setStateUserdetail({
            name: '',

            phone: '',
            isAdmin: false,
            detailAddress: '',
            tinh: '',
            huyen: '',
            xa: ''
        })
        form1.resetFields()
        setInfoOrder(false)
    }
    const handleChangeAddress = () => {
        setInfoOrder(true)

    }
    //=========================================
    const [delivery, setDelivery] = useState('fast')
    const [payment, setPayment] = useState('later_money')

    const handleDilivery = (e) => {
        setDelivery(e.target.value)
    }
    const handlePayment = (e) => {
        setPayment(e.target.value)
    }
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
    const { data: dataOrder, isPending: isPendingOrder, isSuccess, isError } = mutationAddOrder
    useEffect(() => {
        if (isSuccess && dataOrder?.status === 'OK') {
            // message.success('Đặt hằng thành cống')
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const mutationRemove = useMutationHook(
        (data1) => {
            CardService.deleteCard(data1);
        }
    );

    const [searchParams] = useSearchParams()
    const params = searchParams?.getAll


    useEffect(() => {

    }, [params])

    const handleAddOrder = () => {

        if (user?.access_token && order?.orderItemsSlected && user?.name
            && user?.address && user?.phone && priceMemo && user?.id) {
            // eslint-disable-next-line no-unused-expressions
            console.log('bodyyy', {
                token: user?.access_token,
                orderItems: order?.orderItemsSlected,
                fullName: user?.name,
                address: user?.address,
                phone: user?.phone,
                detailAddress: user?.detailAddress,

                paymentMethod: payment,
                itemsPrice: priceMemo,
                shippingPrice: diliveryPriceMemo,
                totalPrice: totalPriceMemo,
                user: user?.id
            });


            dispatch(update({

                orderItems: order?.orderItemsSlected,
                shippingAddress: {
                    address: user?.address,

                    phone: user?.phone,

                },
                paymentMethod: payment,
                itemsPrice: priceMemo,
                shippingPrice: diliveryPriceMemo,
                totalPrice: totalPriceMemo,
            }))
            if (payment === 'VNPay') {
                let test = addOrderVNPay()
            } else {
                mutationAddOrder.mutate(
                    {
                        token: user?.access_token,
                        orderItems: order?.orderItemsSlected,
                        fullName: user?.name,
                        address: user?.address,
                        phone: user?.phone,

                        paymentMethod: payment,
                        itemsPrice: priceMemo,
                        shippingPrice: diliveryPriceMemo,
                        totalPrice: totalPriceMemo,
                        user: user?.id,
                        note: value,
                        email: user?.email
                    }, {
                    onSuccess: () => {

                        if (isPendingOrder === false) {

                            const arrayOrdered = []
                            order?.orderItemsSlected?.forEach(element => {
                                arrayOrdered.push(element.product)
                            });
                            mutationRemove.mutate({ user: user.id, productList: [...arrayOrdered] });
                            dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }))

                            message.success('Đặt hàng thành công')

                            navigate('/orderSuccess', {
                                state: {
                                    delivery,
                                    payment,
                                    orders: order?.orderItemsSlected,
                                    totalPriceMemo: totalPriceMemo
                                }
                            })
                        }
                    }
                }
                )
            }



        } else if (!user.address) {
            setInfoOrder(true)
        }
    }


    const addOrderVNPay = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("access_token"));
            if (!token) {
                return false;
            }

            const res = await axios.post(
                `http://localhost:3001/api/order/payment_vnpay_url/${user.id}`,
                { totalPriceMemo, user },
                {
                    headers: {
                        token: `Bearer ${token}`,
                    }
                },
            );

            window.location.href = res.data.vnpUrl;
            return true;
        } catch (error) {
            return false;
        }
    };


    return (
        <div className={cx('wrapper')}>
            <h4><span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Trang Chủ</span> - <span>Thanh Toán</span></h4>
            <Loading isLoading={isPendingOrder}>
                <div className={cx('inner')}>

                    <div className={cx('left')}>
                        <div className={cx('info')}>
                            <div>
                                <span className={cx('lable')}>Chọn phương thức giao hàng</span>
                                <Radio.Group className={cx('radio-group')} onChange={handleDilivery} value={delivery}>
                                    <Radio value="fast"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>FAST</span> Giao hàng tiết kiệm</Radio>
                                    <Radio value="gojek"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                                </Radio.Group>
                            </div>

                        </div>
                        <div className={cx('info')}>
                            <div>
                                <span className={cx('lable')}>Chọn phương thức thanh toán</span>
                                <Radio.Group className={cx('radio-group')} onChange={handlePayment} value={payment}>
                                    <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                                    <Radio value="VNPay"> Thanh toán VNPAY</Radio>

                                    {/* <button type='button' onClick={addOrderVNPay}>Thanh toán VNPAY</button> */}
                                </Radio.Group>
                            </div>

                        </div>
                        <div className={cx('info')}>
                            <span className={cx('lable')}>Chi tiết đơn hàng</span>
                            <div>
                                <span className={cx('lable')}>Ghi chú cho đơn hàng</span>
                                <TextArea
                                    className={cx('radio-group-note ')}
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="Ghi chú..."
                                    autoSize={{
                                        minRows: 3,
                                        maxRows: 5,
                                    }}
                                />
                            </div>

                        </div>
                        <div className={cx('info')}>
                            <div className={cx('header')}>
                                <span style={{ display: 'inline-block', width: '390px' }}>

                                    <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                                </span>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>Đơn giá</span>
                                    <span>Số lượng</span>
                                    <span>Thành tiền</span>
                                </div>
                            </div>
                        </div>
                        <div className={cx('info')}>
                            <div>
                                {
                                    order?.orderItemsSlected && order?.orderItemsSlected.map((item, index) => (
                                        <div className={cx('item-order')} key={index}>

                                            <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 4 }}>

                                                <Images src={item?.image} style={{ width: '150px', height: '90px', objectFit: 'cover' }} />
                                                <div style={{
                                                    width: 260,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',

                                                }}>{item?.name}</div>

                                            </div>


                                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                {/* <span>
                                                    <span style={{ fontSize: '13px', color: '#242424' }}>{item?.price}-{item.discount}</span>
                                                </span> */}
                                                {
                                                    item.discount ?
                                                        <div >
                                                            {/* <p className={cx('old-price')}>{formatCurrency(item?.price)}</p> */}
                                                            <p>{formatCurrency(item.price - (item?.price * item?.discount) / 100)}</p>
                                                        </div> : <p >{formatCurrency(item?.price)}</p>
                                                }
                                                <p>
                                                    {item?.amount}
                                                </p>
                                                <span style={{ color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500 }}>{formatCurrency((item.price - (item?.price * item?.discount) / 100) * item?.amount)}</span>
                                            </div>


                                        </div>
                                    ))
                                }

                            </div>
                        </div>

                    </div>
                    <div className={cx('right')}>
                        <div style={{ width: '100%' }}>
                            <div className={cx('info')}>Thông tin </div>
                            <div className={cx('info')}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>Tạm tính</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{formatCurrency(priceMemo)}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>Giảm giá</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{formatCurrency(priceDiscountMemo)}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>Phí giao hàng</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{formatCurrency(diliveryPriceMemo)}</span>
                                </div>
                                <div className={cx('total')}>
                                    <span>Tổng tiền</span>
                                    <span style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>{formatCurrency(totalPriceMemo)}</span>
                                        <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
                                    </span>

                                </div>

                            </div>

                            <Button onClick={handleAddOrder} bntOrder style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>ĐẶT HÀNG</Button>
                            {/* <Button type='button' onClick={addOrderVNPay}>Thanh toán VNPAY</Button> */}
                            <div className={cx('info-address')}>
                                <p>Địa chỉ giao hàng:</p>
                                <span style={{ fontWeight: 'bold' }}>{user?.address} </span>
                                <span onClick={handleChangeAddress} style={{ color: '#9255FD', cursor: 'pointer' }}>Thay đổi</span>
                            </div>

                        </div>

                    </div>

                </div>
                < ModalComponent title="Cập nhật thông tin giao hàng"
                    open={infoOrder}
                    onOk={handleOk}
                    onCancel={handleCancleUpdate}
                    footer={null}
                >
                    <Loading isLoading={isLoadingUpdated}>
                        < Form
                            name="basic"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            style={{
                                maxWidth: 600,
                            }}

                            autoComplete="on"
                            onFinish={onFinishUpdate}
                            onFinishFailed={onFinishFailed}
                            form={form1}

                        >
                            <Form.Item
                                label="Tên người dùng"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên người dùng!',
                                    },
                                ]}
                            >
                                <Input value={stateUserDetail.name} onChange={handleOnChangeDetail} name="name" />
                            </Form.Item>


                            {/* <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập email!',
                                    },
                                ]}
                            >
                                <Input value={stateUserDetail.email} onChange={handleOnChangeDetail} name="email" />

                            </Form.Item> */}
                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số điện thoại!',
                                    },
                                ]}
                            >
                                <Input value={stateUserDetail.phone} onChange={handleOnChangeDetail} name="phone" />

                            </Form.Item>
                            <Form.Item
                                label="Tỉnh/Thành Phố"
                                name="tinh"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tỉnh',
                                    },
                                ]}
                            >
                                <Input value={stateUserDetail.tinh} onChange={handleOnChangeDetail} name="tinh" />

                            </Form.Item>
                            <Form.Item
                                label="Quận/Huyện"
                                name="huyen"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập huyện/thành phố',
                                    },
                                ]}
                            >
                                <Input value={stateUserDetail.huyen} onChange={handleOnChangeDetail} name="huyen" />

                            </Form.Item>
                            <Form.Item
                                label="Xã/Phường"
                                name="xa"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập xã/phường',
                                    },
                                ]}
                            >
                                <Input value={stateUserDetail.xa} onChange={handleOnChangeDetail} name="xa" />

                            </Form.Item>
                            <Form.Item
                                label="Đường/Ấp/Sô Nhà"
                                name="detailAddress"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập địa chỉ cụ thể',
                                    },
                                ]}
                            >
                                <Input value={stateUserDetail.detailAddress} onChange={handleOnChangeDetail} name="detailAddress" />

                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button btnBuy type="primary" htmlType="submit">
                                    Cập nhật
                                </Button>
                            </Form.Item>


                        </Form>
                    </Loading>

                </ModalComponent>
            </Loading >
        </div >
    );
}

export default Payment;