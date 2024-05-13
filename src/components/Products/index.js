import styles from './Products.module.scss'
import classNames from 'classnames/bind';
import Images from '../Images';
import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as ImageService from '~/services/ImageService'
import { useMutationHook } from '~/hooks/useMutationHook';
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'antd';



const cx = classNames.bind(styles)

function Products({ data }) {

    const [image, setImage] = useState()

    const searchRedux = useSelector((state) => state?.product?.search)
    useEffect(() => {
        if (data?.idsImage.length > 0) {
            const fetchImage = async (id) => {

                const res = await ImageService.getDetailsImage(id)


                setImage(res?.data?.image)

            }
            fetchImage(data?.idsImage[0])

        }
    }, [data?.idsImage[0]])


    function formatCurrency(number) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    }
    return (

        <NavLink to={`/product/${encodeURIComponent(data._id)}`}>
            <div className={cx('wrapper')}>
                <div className={cx('image')}>
                    <Images src={image} Product></Images>
                    {
                        data?.discount && <div><Button Sale className={cx('sale')} ><h4>-{data.discount}%</h4></Button></div>
                    }
                </div>
                <p style={{ margin: '10px 0' }}>{data.name}</p>

                {/* <h5 className={cx('price')}>{formatCurrency(data.price)}</h5> */}
                {
                    data.discount ?
                        <div >
                            <p className={cx('old-price')}>{formatCurrency(data?.price)}</p>
                            <h4 className={cx('price')}>{formatCurrency(data.price - (data?.price * data?.discount) / 100)}</h4>
                        </div> : <h1 className={cx('price')}>{formatCurrency(data?.price)}</h1>
                }
                {
                    data.selled ? <p style={{ color: 'gray' }}>Đã bán: {data.selled}</p> : <></>
                }
            </div>
        </NavLink>



    );
}

export default Products;