import classNames from "classnames/bind";
import styles from './Menu.module.scss'

const cx = classNames.bind(styles)

function Menu({ children, menuAccountItem, }) {

    const classes = cx('wrapper', {
        menuAccountItem,
    })

    return (
        <nav className={classes} >
            {children}
        </nav>
    );
}

export default Menu; 