import { NavLink } from "react-router-dom";
import styles from './Menu.module.scss'
import classNames from "classnames/bind";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

function MenuAdmin({ title, to, icon, menuAccount, onClick, activeMenu }) {



    const handleClick = () => {
        onClick(title);
    };

    return (
        <div onClick={handleClick} className={cx({ activeAdmin: activeMenu === title }, 'wrapper', 'admin', menuAccount)}>
            <FontAwesomeIcon className={cx('icon-admin')} icon={icon}></FontAwesomeIcon>
            <span>{title}</span>
        </div>
    );
}

export default MenuAdmin;
//className={cx({ active: activeMenu === title }, 'wrapper', menuAccount)}