import { NavLink } from "react-router-dom";
import styles from './Menu.module.scss'
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function MenuItem({ title, to, activeHome }) {


    return (
        <NavLink
            to={to}
            className={(nav) => cx({ activeHomee: nav.isActive }, activeHome)}
        >
            <span>{title}</span>

        </NavLink >
    );
}

export default MenuItem;