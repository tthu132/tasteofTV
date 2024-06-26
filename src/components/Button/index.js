import classNames from "classnames/bind";
import styles from './Button.module.scss'
import { Link } from "react-router-dom";

const cx = classNames.bind(styles)
function Button({ to,
    href,
    onClick,
    btnQuality,
    btnControl,
    children,
    btnAdd,
    btnDetail,
    btnCategory,
    buttonLogin,
    btnRegister,
    disabled,
    rounded,
    buttonProfile,
    buttonLogout, buttonLoginFrom, btnEye, upDate, Plus ,bntOrder,Sale,btnBuy}) {

    let Comp = 'button'
    const classes = cx('wrapper', {
        buttonLogin,
        Plus,
        rounded,
        disabled,
        btnRegister,
        buttonProfile,
        buttonLogout,
        btnCategory,
        btnAdd,
        btnDetail,
        btnQuality,
        btnControl,
        buttonLoginFrom,
        btnEye, upDate,bntOrder,Sale,btnBuy
    })

    const props = {
        onClick,


    }
    if (disabled) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key]
            }
        })
    }

    if (to) {
        props.to = to
        Comp = Link

    } else if (href) {
        props.href = href
        Comp = 'a'
    }

    return (
        <Comp className={classes} {...props} >
            <span>{children}</span>

        </Comp>
    );
}

export default Button;