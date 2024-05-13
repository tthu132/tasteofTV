import styles from './QuanLyDonHang.module.scss'
import classNames from 'classnames/bind';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import * as OrderService from '~/services/OrderService'
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '~/components/Loading';
import { useState } from 'react';
import OrderList from '~/components/OrderList';


const cx = classNames.bind(styles)

function QuanLyDonHang() {
    const user = useSelector((state) => state.user)

    const location = useLocation()
    const { state } = location
    // const navigate = useNavigate()
    let token
    let id
    if (state?.token) {
        token = state?.token
        id = state?.id
    } else {
        token = user?.access_token
        id = user?.id
    }

    const fetchMyOrder = async () => {
        const res = await OrderService.getOrderByUserId(id, token)

        return res.data
    }
    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: fetchMyOrder, })
    const { isPending, data } = queryOrder

    const status1 = "Đặt hàng thành công";
    const status2 = "Chờ thanh toán";
    const status3 = "Đang xử lý";
    const status4 = "Đang vận chuyển";
    const status5 = "Đã giao";
    const status6 = "Đã hủy";

    const ordersWithDesiredStatus1 = data?.filter(order => order.status === status1);
    const ordersWithDesiredStatus2 = data?.filter(order => order.status === status2);

    const ordersWithDesiredStatus3 = data?.filter(order => order.status === status3);
    const ordersWithDesiredStatus4 = data?.filter(order => order.status === status4);
    const ordersWithDesiredStatus5 = data?.filter(order => order.status === status5);



    const [activeMenuItem, setActiveMenuItem] = useState('Tất cả đơn');

    // Xử lý sự kiện click của menu
    const handleMenuClick = (title) => {
        setActiveMenuItem(title); // Cập nhật trạng thái menu đang được chọn
    };

    return (
        <Loading isLoading={isPending}>
            <div className={cx('wraper')}>
                <h2>Đơn hàng của tôi</h2>
                <div className={cx('inner')}>

                    <div className={cx('header')}>
                        <ul>
                            {/* Đối với mỗi menu, áp dụng className active nếu menu đang được chọn */}
                            <li className={activeMenuItem === 'Tất cả đơn' ? cx('active') : ''} onClick={() => handleMenuClick('Tất cả đơn')}>Tất cả đơn</li>
                            <li className={activeMenuItem === 'Chờ thanh toán' ? cx('active') : ''} onClick={() => handleMenuClick('Chờ thanh toán')}>Chờ thanh toán</li>
                            <li className={activeMenuItem === 'Đang xử lý' ? cx('active') : ''} onClick={() => handleMenuClick('Đang xử lý')}>Đang xử lý</li>
                            <li className={activeMenuItem === 'Đang vận chuyển' ? cx('active') : ''} onClick={() => handleMenuClick('Đang vận chuyển')}>Đang vận chuyển</li>
                            <li className={activeMenuItem === 'Đã giao' ? cx('active') : ''} onClick={() => handleMenuClick('Đã giao')}>Đã giao</li>
                            <li className={activeMenuItem === 'Đã hủy' ? cx('active') : ''} onClick={() => handleMenuClick('Đã hủy')}>Đã hủy</li>
                        </ul>
                    </div>

                    {/* Dựa vào trạng thái menu đang được chọn, hiển thị dữ liệu tương ứng */}





                </div>
                <div className={cx('content')}>
                    {activeMenuItem === 'Tất cả đơn' && <OrderList data={data} />}
                    {activeMenuItem === 'Chờ thanh toán' && <OrderList data={ordersWithDesiredStatus2} />}
                    {activeMenuItem === 'Đang xử lý' && <OrderList data={ordersWithDesiredStatus3} />}
                    {activeMenuItem === 'Đang vận chuyển' && <OrderList data={ordersWithDesiredStatus4} />}
                    {activeMenuItem === 'Đã giao' && <OrderList data={ordersWithDesiredStatus5} />}
                    {activeMenuItem === 'Đã hủy' && <OrderList data={[]} />} {/* Không có đơn hàng nào trong trạng thái này */}
                </div>
            </div>
        </Loading>
    );
}

export default QuanLyDonHang;