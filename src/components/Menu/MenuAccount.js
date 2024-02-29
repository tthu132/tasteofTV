import { NavLink } from "react-router-dom";
import styles from './Menu.module.scss'
import classNames from "classnames/bind";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

function MenuAccount({ title, to, icon, menuAccount, onClick }) {



    // const handleClick = (event) => {
    //     onClick(title); // Gọi hàm callback và truyền title của menu
    //     event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ liên kết
    //     onClick(title); // Gọi hàm callback và truyền title của menu
    // };

    return (
        <NavLink
            // onClick={handleClick}
            to={to}
            className={(nav) => cx({ active: nav.isActive }, 'wrapper', menuAccount)}
        >
            <FontAwesomeIcon className={cx('icon')} icon={icon}></FontAwesomeIcon>
            <span>{title}</span>

        </NavLink >
    );
}

export default MenuAccount;