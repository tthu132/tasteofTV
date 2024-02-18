import classNames from "classnames/bind";
import styles from './Button.module.scss'
import { Link } from "react-router-dom";

const cx = classNames.bind(styles)
function Button({ to, href, onClick, children, buttonLogin, btnRegister, disabled, rounded, buttonProfile, buttonLogout }) {

    let Comp = 'button'
    const classes = cx('wrapper', {
        buttonLogin,
        disabled,
        rounded,
        disabled,
        btnRegister,
        buttonProfile,
        buttonLogout
    })

    const props = {
        onclick,


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