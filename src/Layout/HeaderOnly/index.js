import Header from "../components/Header";
import Footer from "../components/Footer";
import SidebarAccount from "../components/SidebarAccount";
import classNames from "classnames/bind";
import styles from './HeaderOnly.module.scss'

const cx = classNames.bind(styles)

function HeaderOnly({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header className={cx('header')} />
            <div className={cx('inner')}>
                <SidebarAccount></SidebarAccount>
                <div className={cx('container')}>
                    {children}
                </div>
            </div>
            <Footer />


        </div>
    );
}

export default HeaderOnly;