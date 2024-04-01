import { useNavigate } from 'react-router-dom';
import styles from './OrderPage.module.scss'
import classNames from 'classnames/bind';
import { useDispatch, useSelector, } from 'react-redux';
import { Checkbox, Form, Input } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import Images from '~/components/Images';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '~/redux/slice/orderSlice';
import { useEffect, useMemo, useState } from 'react';
import Button from '~/components/Button';
import ModalComponent from "~/components/ModalComponent";
import { useMutationHook } from '~/hooks/useMutationHook';
import Loading from '~/components/Loading';

import * as UserService from '~/services/UserService'
import * as message from '~/components/Message'
import { updateUser } from '~/redux/slice/userSlide'
import StepComponent from '~/components/StepComponent';
import * as CardService from '~/services/CardService'



const cx = classNames.bind(styles)

function OrderPage() {
    const navigate = useNavigate()
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)
    console.log('bodyy 20', user);
    console.log('bodyy 202', order);
    const [listChecked, setListChecked] = useState([])

    const dispatch = useDispatch()

    console.log('order ', order);

    const saveCartToLocalStorage = (order) => {
        localStorage.setItem(`order${user.id}`, JSON.stringify(order));
    };
    useEffect(() => {
        // Lưu giỏ hàng vào localStorage khi có sự thay đổi trong Redux
        saveCartToLocalStorage(order);
    }, [order]);

    const handleOnchangeCheckAll = (e) => {
        if (e.target.checked) {
            const newListChecked = []
            order?.orderItems?.forEach((item) => {
                newListChecked.push(item?.product)
            })
            setListChecked(newListChecked)
        } else {
            setListChecked([])
        }

    }
    const onChange = (e) => {
        if (listChecked.includes(e.target.value)) {
            const newListChecked = listChecked.filter((item) => item !== e.target.value)
            setListChecked(newListChecked)
        } else {
            setListChecked([...listChecked, e.target.value])
        }


    }
    console.log('checked ', listChecked);
    const mutation = useMutationHook(
        (data) => {
            CardService.updateCard(data)
        }
    )
    const handleChangeCount = (type, idProduct, index) => {
        console.log('checkkk id pr ', idProduct);
        console.log('counter 1', order?.orderItems[index]?.amount);
        console.log('counter 1', order?.orderItems[index]?.countInstock);


        if (type === 'increase' && order?.orderItems[index]?.amount < order?.orderItems[index]?.countInstock) {
            mutation.mutate({ user: user.id, product: idProduct, newQuantity: order?.orderItems[index]?.amount + 1 })
            dispatch(increaseAmount({ idProduct }))
        } else if (type === 'decrease' && order?.orderItems[index]?.amount > 1) {
            mutation.mutate({ user: user.id, product: idProduct, newQuantity: order?.orderItems[index]?.amount - 1 })
            dispatch(decreaseAmount({ idProduct }))
        }



    }
    console.log('orderNe ', order);
    const mutationRemove = useMutationHook(
        (data1) => {
            CardService.deleteCard(data1);
        }
    );
    const handleDeleteOrder = (idProduct) => {

        mutationRemove.mutate({ user: user.id, productList: [idProduct] });
        dispatch(removeOrderProduct({ idProduct }))

    }
    const handleRomveAll = () => {
        console.log('removeeee', listChecked.length);
        if (listChecked?.length > 1) {
            console.log('removeeee');
            mutationRemove.mutate({ user: user.id, productList: [...listChecked] });
            dispatch(removeAllOrderProduct({ listChecked }))
        }
    }
    useEffect(() => {
        console.log('list-checked 1', listChecked);
        dispatch(selectedOrder({ listChecked }))
    }, [listChecked])


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

    function formatCurrency(number) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    }
    //=====================================================

    const [form1] = Form.useForm();
    const [infoOrder, setInfoOrder] = useState(false)
    const [stateUserDetail, setStateUserdetail] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        address: '',
        city: ''
    })
    useEffect(() => {
        if (infoOrder) {
            setStateUserdetail({
                city: user?.city,
                name: user?.name,
                address: user?.address,
                phone: user?.phone,
                email: user?.email
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

    const handleOrder = () => {
        console.log('dathang ', user);
        if (!user.address) {
            setInfoOrder(true)
        } else if (!order?.orderItemsSlected?.length) {
            message.error('Vui lòng chọn sản phẩm !')
        } else {
            navigate('/payment')
        }
    }

    const handleOk = () => {
        console.log(stateUserDetail);
        const { name, phone, address, city } = stateUserDetail
        if (name && phone && address && city) {
            mutationUpdate.mutate({ id: user.id, token: user.access_token, ...stateUserDetail }, {
                onSuccess: () => {
                    dispatch(updateUser({ name, address, city, phone }))
                    setInfoOrder(false)
                }
            });
        }
    }
    const handleCancleUpdate = () => {
        setStateUserdetail({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
        })
        form1.resetFields()
        setInfoOrder(false)
    }
    const handleChangeAddress = () => {
        setInfoOrder(true)
    }
    const items = [
        {
            title: '20.000 VND',
            description: 'Dưới 200.000 VND',
        },
        {
            title: '10.000 VND',
            description: 'Từ 200.000 VND đến dưới 500.000 VND',
        },
        {
            title: 'Free ship',
            description: 'Trên 500.000 VND',
        },
    ]
    return (
        <div className={cx('wrapper')}>
            <h4><span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Trang Chủ</span> - <span>Order</span></h4>
            <div className={cx('inner')}>

                <div className={cx('left')}>

                    <div className={cx('header-dilivery')}>

                        <StepComponent current={diliveryPriceMemo === 10000
                            ? 1 : diliveryPriceMemo === 20000 ? 0
                                : order.orderItemsSlected.length === 0 ? 0 : 2} items={items} ></StepComponent>

                    </div>

                    <div className={cx('header')}>
                        <span style={{ display: 'inline-block', width: '390px' }}>
                            <Checkbox checked={listChecked?.length === order?.orderItems?.length} onChange={handleOnchangeCheckAll} ></Checkbox>
                            <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                        </span>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>Đơn giá</span>
                            <span>Số lượng</span>
                            <span>Thành tiền</span>
                            <DeleteOutlined style={{ cursor: 'pointer' }} onClick={handleRomveAll} />
                        </div>
                    </div>

                    <div className={cx('list-order')}>
                        {order?.orderItems && order?.orderItems?.map((item, index) => (

                            <div className={cx('item-order')} key={index}>

                                <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Checkbox checked={listChecked.includes(item?.product)} onChange={onChange} value={item.product}></Checkbox>
                                    <Images src={item?.image} style={{ width: '150px', height: '90px', objectFit: 'cover' }} />
                                    <div style={{
                                        width: 260,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',

                                    }}>{item?.name}</div>


                                </div>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>
                                        <span style={{ fontSize: '13px', color: '#242424' }}>{item?.price}-{item.discount}</span>
                                    </span>
                                    <div className={cx('counter-order')}>
                                        <button style={{ height: '30px', border: 'none', width: '45px', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', item?.product, index)}>
                                            <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                        </button>
                                        <input className={cx('btn-count')} defaultValue={item?.amount} value={item?.amount} size="small" min={1} max={item?.countInstock} />
                                        <button style={{ border: 'none', width: '45px', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', item?.product, index)}>
                                            <PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                        </button>
                                    </div>
                                    <span style={{ color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500 }}>{(item?.price * item?.amount)}</span>
                                    <DeleteOutlined style={{ cursor: 'pointer' }} onClick={() => handleDeleteOrder(item?.product)} />
                                </div>


                            </div>
                        ))}

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

                        <Button onClick={handleOrder} bntOrder style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>MUA HÀNG</Button>
                        <div className={cx('info-address')}>
                            <p>Địa chỉ giao hàng:</p>
                            <span style={{ fontWeight: 'bold' }}>{`${user?.address} ${user?.city}`} </span>
                            <span onClick={handleChangeAddress} style={{ color: '#9255FD', cursor: 'pointer' }}>Thay đổi</span>
                        </div>

                    </div>

                </div>

            </div>
            < ModalComponent title="Cập nhật thông tin giao hàng"
                open={infoOrder}
                onOk={handleOk}
                onCancel={handleCancleUpdate}
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


                        <Form.Item
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

                        </Form.Item>
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
                            label="Thành phố"
                            name="city"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập thành phố',
                                },
                            ]}
                        >
                            <Input value={stateUserDetail.city} onChange={handleOnChangeDetail} name="city" />

                        </Form.Item>
                        <Form.Item
                            label="Địa chỉ giao hàng"
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập địa chỉ giao hàng!',
                                },
                            ]}
                        >
                            <Input value={stateUserDetail.address} onChange={handleOnChangeDetail} name="address" />

                        </Form.Item>
                        {/* <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                    </Form.Item> */}
                    </Form>
                </Loading>

            </ModalComponent>
        </div>
    );
}

export default OrderPage;