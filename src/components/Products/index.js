import styles from './Products.module.scss'
import classNames from 'classnames/bind';
import Images from '../Images';
import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as ImageService from '~/services/ImageService'
import { useMutationHook } from '~/hooks/useMutationHook';
import { useSelector, useDispatch } from 'react-redux'



const cx = classNames.bind(styles)

function Products({ data }) {

    const [image, setImage] = useState()

    const searchRedux = useSelector((state) => state?.product?.search)
    console.log('xuuuuuu ', data);
    useEffect(() => {
        if (data.idsImage.length > 0) {
            const fetchImage = async (id) => {

                const res = await ImageService.getDetailsImage(id)
                console.log('resssssssssssssss', res);


                setImage(res.data.image)

            }
            fetchImage(data.idsImage[0])

            console.log('xuuuuu 1 ', image);
        }
    }, [data.idsImage[0]])


    console.log('dataaaaaa', data.idsImage);
    function formatCurrency(number) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    }
    return (

        <NavLink to={`/product/${encodeURIComponent(data._id)}`}>
            <Images src={image} Product></Images>
            <p>{data.name}</p>
            <h4 className={cx('price')}>{formatCurrency(data.price)}</h4>
            {
                data.selled && <p style={{ color: 'gray' }}>Đã bán: {data.selled}</p>
            }
        </NavLink>



    );
}

export default Products;