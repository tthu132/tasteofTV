import styles from './BoxCategory.module.scss'
import classNames from 'classnames/bind';
import Button from '../Button';
import { Link } from 'react-router-dom';
import Loading from '../Loading';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles)
function BoxCategory({ item, children, onLoadMore, isLoading, check }) {
    console.log('checkvv ', item._id);
    console.log('checkvv ', item.name);

    const navigate = useNavigate()


    return (
        <Loading isLoading={isLoading}>
            <h1>{item._id}</h1>
            <div className={cx('wrapper')}>
                <Button btnCategory onClick={() => navigate(`/type/${item._id}`)}>{item.name}</Button>

                <div className={cx('inner')} >
                    {children}
                </div>

                {/* <Link to={item.src}> </Link> */}
                <Button disabled={check} btnDetail onClick={onLoadMore}>Xem thêm </Button>

            </div>
        </Loading>
    );
}

export default BoxCategory;