import styles from './BoxCategory.module.scss'
import classNames from 'classnames/bind';
import Button from '../Button';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles)
function BoxCategory({ item, children }) {
    return (
        <div className={cx('wrapper')}>
            <Link to={item.src}><Button btnCategory>{item.title}</Button></Link>

            <div className={cx('inner')} >
                {children}
            </div>

            <Link to={item.src}><Button btnDetail>Xem thêm </Button> </Link>

        </div>
    );
}

export default BoxCategory;