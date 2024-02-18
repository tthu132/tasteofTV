import styles from './Popper.module.scss'
import classNames from 'classnames/bind';

const cx = classNames.bind(styles)
function Wrapper({ children,popperUser,popperUserAccept }) {
    const classes = cx('wrapper', {
        popperUser,
        popperUserAccept
    })
    return (
        <div className={classes}>{children}</div>
    );
}

export default Wrapper;