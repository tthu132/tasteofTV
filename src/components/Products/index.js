import styles from './Products.module.scss'
import classNames from 'classnames/bind';
import Images from '../Images';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles)

function Products({ data }) {
    return (

        <Link to={`/@${data.nickname}`}>
            <Images src={data.avatar}></Images>
            <p>{data.full_name}</p>
        </Link>



    );
}

export default Products;