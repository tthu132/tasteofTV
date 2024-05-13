import styles from './OrderList.module.scss'
import classNames from 'classnames/bind';
import images from "~/images";
import Images from "../Images";
import {
    TruckOutlined
} from '@ant-design/icons';
import Button from '../Button';
import { useLocation, useNavigate } from 'react-router-dom';
import * as OrderService from '~/services/OrderService'
import { useMutationHook } from '~/hooks/useMutationHook';
import { useQuery } from '@tanstack/react-query';
import * as message from '~/components/Message'

const cx = classNames.bind(styles)

function OrderList({ data }) {
    const location = useLocation()
    const { state } = location
    const navigate = useNavigate()


    const handleDetailOrder = (id) => {
        navigate(`/detail-order/${id}`, {
            state: {
                token: state?.token
            }
        })

    }


    const handleCancelOrder = (id) => {
        // mutation.mutate({ id: order._id, token: state?.token, orderItems: order?.orderItems, userId: user.id }, {
        //     onSuccess: () => {
        //         message.success('hủy thành công')
        //         //   queryOrder.refetch()
        //     },
        // })
    }


    function formatCurrency(number) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    }
    return (


        <div className={cx('wrapper')}>
            {
                data?.length > 0 ? <div className={cx('inner-no')}>
                    {
                        data?.map((item) => (
                            <div key={item._id} className={cx('item')}>
                                <span className={cx('status')}>
                                    <TruckOutlined style={{ fontSize: '26px', color: 'gray', marginRight: '5px' }} />
                                    <b>{item.status}</b>

                                </span>
                                <hr></hr>
                                <div className={cx('content')}>
                                    {
                                        item.orderItems.map((item2, index) => (
                                            <div className={cx('content-item')}>
                                                <Images imageOrderList src={item2.image} />

                                                <span>
                                                    <b>{item2.name}</b>
                                                    <p>Số lượng: {item2.amount}</p>
                                                </span>

                                                <p>Giá tiền: {formatCurrency(item2.price)}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                                <hr></hr>
                                <div className={cx('footer')}>
                                    <p className={cx('price')} style={{ right: '0' }}>Tổng tiền: {formatCurrency(item?.itemsPrice)}</p>
                                </div>
                                <div className={cx('action')}>
                                    <Button onClick={() => handleCancelOrder(item._id)}>Hủy đơn</Button>
                                    <Button onClick={() => handleDetailOrder(item._id)}>Xem chi tiết</Button>

                                </div>
                            </div>
                        ))
                    }

                </div> : <div className={cx('inner-no')} >
                    <Images noOrder src={images.noiOrder}></Images>
                    <p>Chưa có đơn hàng</p>
                </div>
            }

        </div>
    );
}

export default OrderList;