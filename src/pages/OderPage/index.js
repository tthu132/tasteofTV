import { useNavigate } from 'react-router-dom';
import styles from './OrderPage.module.scss'
import classNames from 'classnames/bind';
import { useDispatch, useSelector, } from 'react-redux';
import { Checkbox } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import Images from '~/components/Images';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct } from '~/redux/slice/orderSlice';
import { useState } from 'react';



const cx = classNames.bind(styles)

function OrderPage() {
    const navigate = useNavigate
    const order = useSelector((state) => state.order)
    const [listChecked, setListChecked] = useState([])

    const dispatch = useDispatch()

    console.log('order ', order);
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
    const handleChangeCount = (type, idProduct) => {
        console.log('iddddd', idProduct);
        if (type === 'increase') {
            dispatch(increaseAmount({ idProduct }))
        } else {
            dispatch(decreaseAmount({ idProduct }))
        }

    }
    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct({ idProduct }))

    }
    const handleRomveAll = () => {
        console.log('removeeee', listChecked.length);
        if (listChecked?.length > 1) {
            console.log('removeeee');

            dispatch(removeAllOrderProduct({ listChecked }))
        }
    }
    return (
        <div className={cx('wrapper')}>
            <h4><span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Trang Chủ</span> - <span>Order</span></h4>
            <div className={cx('inner')}>

                <div className={cx('left')}>

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
                        {order?.orderItems?.map((item, index) => (

                            <div className={cx('item-order')} key={index}>

                                <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Checkbox checked={listChecked.includes(item?.product)} onChange={onChange} value={item.product}></Checkbox>
                                    <Images src={item?.image} style={{ width: '150px', height: '90px', objectFit: 'cover' }} />
                                    <div style={{
                                        width: 260,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>{item?.name}</div>


                                </div>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>
                                        <span style={{ fontSize: '13px', color: '#242424' }}>{item?.price}</span>
                                    </span>
                                    <div className={cx('counter-order')}>
                                        <button style={{ height: '30px', border: 'none', width: '45px', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', item?.product)}>
                                            <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                        </button>
                                        <input className={cx('btn-count')} defaultValue={item?.amount} value={item?.amount} size="small" min={1} max={item?.countInstock} />
                                        <button style={{ border: 'none', width: '45px', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', item?.product, item?.amount === item.countInstock, item?.amount === 1)}>
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
                        <div className={cx('info')}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>Tạm tính</span>
                                <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}></span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>Giảm giá</span>
                                <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}></span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>Phí giao hàng</span>
                                <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}></span>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default OrderPage;