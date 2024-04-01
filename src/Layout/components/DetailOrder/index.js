import { useLocation, useParams } from "react-router-dom";
import styles from './DetailOrder.module.scss'
import classNames from 'classnames/bind';
import { useEffect, useMemo, useState } from 'react'
import * as OrderService from '~/services/OrderService'
import { useQuery } from '@tanstack/react-query'
import Loading from "~/components/Loading";
import { orderContant } from '~/contant';
import Images from "~/components/Images";
import { useSelector } from 'react-redux';


const cx = classNames.bind(styles)

function DetailOrder() {
    const params = useParams()
    const location = useLocation()
    const { state } = location
    const { id } = params
    const user = useSelector((state) => state.user)
    console.log('haaaaaaaa ', user);


    const [loading, setLoading] = useState(true); // Trạng thái loading
    const fetchDetailsOrder = async () => {
        const res = await OrderService.getDetailsOrder(id, state?.token ? state?.token : user.access_token)
        console.log('state', res.data);
        setLoading(false);
        return res.data
    }
    const queryOrder = useQuery({ queryKey: ['orders-details'], queryFn: fetchDetailsOrder, })
    const { isPending, data } = queryOrder

    console.log('state', data);
    const priceMemo = useMemo(() => {
        const result = data?.orderItems?.reduce((total, cur) => {
            return total + ((cur.price * cur.amount))
        }, 0)
        return result
    }, [data])
    
    const priceDiscountMemo = useMemo(() => {
        return data?.orderItems.reduce((totalDiscount, item) => {
            // Kiểm tra xem trường discount có tồn tại không
            if (item.discount === undefined || item.discount === null) {
                return totalDiscount; // Bỏ qua nếu không có giảm giá
            }

            const totalItemPrice = item.price * item.amount;
            const discountAmount = (totalItemPrice * item.discount) / 100;
            return totalDiscount + discountAmount;
        }, 0);
    }, [data])

    console.log('discount ', priceDiscountMemo);
    return (
        <Loading isLoading={isPending || loading}  >
            <div className={cx('wrapper')}>
                <h2>Chi tiết đơn hàng #{params.id}</h2>
                <div className={cx('inner')}>

                    <div className={cx('info')}>
                        <div className={cx('item-info')}>
                            <span>ĐỊA CHỈ NGƯỜI NHẬN</span>
                            <div>
                                <h4>{data?.shippingAddress.fullName}</h4>
                                <p>Địa chỉ: {data?.shippingAddress.address}</p>
                                <p>Điện thoại: {data?.shippingAddress.phone}</p>
                            </div>
                        </div>

                        <div className={cx('item-info')}>
                            <span>HÌNH THỨC GIAO HÀNG</span>
                            <div>
                                <p>Hình thức giao hàng: </p>
                                <p>Phí giao hàng: {data?.shippingPrice}</p>

                            </div>
                        </div>
                        <div className={cx('item-info')}>
                            <span>HÌNH THỨC THANH TOÁN</span>
                            <div>
                                <p>{orderContant.payment[data?.paymentMethod]} </p>


                            </div>
                        </div>

                    </div>

                    <div className={cx('content')}>
                        <table className={cx('table')}>
                            <thead>
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>Giá</th>
                                    <th>Số lượng</th>
                                    <th>Giảm giá</th>
                                    <th>Tạm tính</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.orderItems.map((product) => (

                                    <tr key={product.id}>

                                        <td style={{ display: 'flex', alignItems: 'center' }}>
                                            <Images imageOrderList src={product?.image}></Images>
                                            {product?.name}
                                        </td>
                                        <td>{product?.price} ₫</td>
                                        <td>{product?.amount}</td>
                                        <td>{product?.discount ? product?.discount : 0} %</td>
                                        <td>{product?.discount ? (product.price - (product.discount * product.price) / 100) * product.amount : product.price * product.amount} ₫</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="4">Tạm tính</td>
                                    <td>{data?.itemsPrice} ₫</td>
                                </tr>
                                <tr>
                                    <td colSpan="4">Phí vận chuyển</td>
                                    <td>{data?.shippingPrice} ₫</td>
                                </tr>
                                <tr>
                                    <td colSpan="4">Giảm giá</td>
                                    <td>{priceDiscountMemo} ₫</td>

                                </tr>
                                <tr>

                                    <td colSpan="4">Tổng cộng</td>
                                    <td>{data?.totalPrice} ₫</td>
                                </tr>
                            </tfoot>
                        </table>
                        <p>{data?.updatedAt}</p>

                    </div>

                </div>

            </div>
        </Loading>
    );
}

export default DetailOrder;