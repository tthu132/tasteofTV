import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import * as ProductService from '~/services/ProductService'
import Products from '~/components/Products';
import { useParams } from 'react-router-dom';

import styles from './KetQuaTimKiem.module.scss'
import classNames from 'classnames/bind';
import Loading from '~/components/Loading';

const cx = classNames.bind(styles)

function KetQuaTimKiem() {
    const { key } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    console.log('key:', key);

    const searchRedux = useSelector((state) => state?.product?.search)
    const [searchResult, setSearchResult] = useState()

    useEffect(() => {
        const fetchProductSearch = async (key) => {
            setIsLoading(true)
            const res = await ProductService.getAllProduct(key)
            console.log('tressssssssssssssst 1', res);
            console.log('tressssssssssssssst 11', res.data[0]);

            setSearchResult(res.data)
            setIsLoading(false);
        }
        fetchProductSearch(key)
    }, [key])
    return (
        <div className={cx('wrapper')}>
            <p>Kết quả tìm kiếm cho "{key}"</p>

            <Loading isLoading={isLoading}>
                {
                    searchResult ? (
                        searchResult.length === 0 ? (
                            <p>Không tìm thấy</p>
                        ) : (
                            <div className={cx('inner')} >
                                {searchResult.map((item, index) => (
                                    <Products key={index} data={item}></Products>
                                ))}
                            </div>
                        )
                    ) : (
                        <p>Đang tải...</p>
                    )
                }
            </Loading>

        </div>
    );
}

export default KetQuaTimKiem;