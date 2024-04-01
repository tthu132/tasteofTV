import Header from "../components/Header";
import Footer from "../components/Footer";
import SidebarAccount from "../components/SidebarAccount";
import classNames from "classnames/bind";
import styles from './LayoutAdmin.module.scss'
import SidebarAdmin from "../components/SidebarAdmin";
const cx = classNames.bind(styles)

function LayoutAdmin({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header className={cx('header')} />
            <div className={cx('inner')}>
                {/* <SidebarAccount></SidebarAccount> */}
                {/* <SidebarAdmin /> */}
                <div className={cx('container')}>
                    {children}
                </div>
            </div>



        </div>
    );
}

export default LayoutAdmin;