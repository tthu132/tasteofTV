import styles from './Admin.module.scss'
import classNames from 'classnames/bind';
import SidebarAdmin from '~/Layout/components/SidebarAdmin';
import QuanLyTaiKhoan from '~/Layout/components/QuanLyTaiKhoan';
import QuanLySanPham from '~/Layout/components/QuanLySanPham';
import { useState } from 'react';
import Header from '~/Layout/components/Header';

const cx = classNames.bind(styles)

function Admin() {
    const [activeMenuItem, setActiveMenuItem] = useState('');

    const handleMenuClick = (title) => {
        setActiveMenuItem(title); // Lưu title của menu đang được chọn
    };

    // Render component tương ứng với menu được chọn
    const renderComponent = () => {
        switch (activeMenuItem) {
            case 'Quản lý tài khoản':
                return <QuanLyTaiKhoan />;
            case 'Quản lý sản phẩm':
                return <QuanLySanPham />;
            // Thêm các case cho các menu khác
            default:
                return null;
        }
    };
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('inner')}>
                <SidebarAdmin handleMenuClick={handleMenuClick} />
                <div className={cx('component-render')}>
                    {renderComponent() || <QuanLyTaiKhoan />}
                </div>
            </div>
        </div>
    );
}

export default Admin;