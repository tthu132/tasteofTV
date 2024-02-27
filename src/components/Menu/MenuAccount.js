import { NavLink } from "react-router-dom";
import styles from './Menu.module.scss'
import classNames from "classnames/bind";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

function MenuAccount({ title, to, icon, menuAccount }) {




    return (
        <NavLink
            to={to}
            className={(nav) => cx({ active: nav.isActive }, 'wrapper', menuAccount)}
        >
            <FontAwesomeIcon className={cx('icon')} icon={icon}></FontAwesomeIcon>
            <span>{title}</span>

        </NavLink >
    );
}

export default MenuAccount;