import styles from './ItemCategory.module.scss'
import classNames from 'classnames/bind';
import Images from '../Images';

const cx = classNames.bind(styles)

function ItemCategory({ data }) {
    return (
        <div className={cx('wrapper')}>
            <Images ItemCategory src={data.imageCategory}></Images>
            <h4>{data.title}</h4>

        </div>
    );
}

export default ItemCategory;