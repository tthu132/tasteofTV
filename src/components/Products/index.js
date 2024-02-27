import styles from './Products.module.scss'
import classNames from 'classnames/bind';
import Images from '../Images';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles)

function Products({ data }) {
    console.log('dataaaaaa', data.full_name);
    function formatCurrency(number) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    }
    return (

        <Link to={`/product/${encodeURIComponent(data.full_name)}`}>
            <Images src={data.image} Product></Images>
            <p>{data.name}</p>
            <h4>{formatCurrency(data.price)}</h4>
        </Link>



    );
}

export default Products;