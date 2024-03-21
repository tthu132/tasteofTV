import { useParams, useNavigate } from "react-router-dom";
import { useState } from 'react';
import * as ProductService from '~/services/ProductService'
import { useQuery } from '@tanstack/react-query';
import Item from "antd/es/list/Item";
import Products from "~/components/Products";
import Loading from "~/components/Loading";
import CardProduct from "~/components/CardProduct";
import styles from './ProductType.module.scss'
import classNames from 'classnames/bind';

const cx = classNames.bind(styles)
function ProductType() {
    const navigate = useNavigate()
    const { key } = useParams();
    const [list, setList] = useState()


    const fetchType = async () => {
        const res = await ProductService.getType(key);
        console.log('abc ', res);
        setList(res.data)
        return res.data
    }
    const { isPending, data } = useQuery({ queryKey: ['product-type'], queryFn: fetchType, enabled: !!key })
    // console.log('datwakey ', data.data);
    console.log('datwakey ', data);



    return (
        <div>
            <h4><span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Trang Chủ</span> - <span>Sản phẩm theo thể loại</span></h4>
            <div>
                <Loading isLoading={isPending}>

                    <div className={cx('inner')}>
                        {data && data?.map((item, index) => (
                            <CardProduct key={index} listProduct={item}></CardProduct>

                        ))}
                    </div>

                </Loading>
            </div>



        </div>
    );
}

export default ProductType;