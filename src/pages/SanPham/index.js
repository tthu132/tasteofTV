import styles from './SanPham.module.scss'
import classNames from 'classnames/bind';
import * as ProductService from '~/services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '~/components/Loading';
import Products from '~/components/Products';
import CardProduct from '~/components/CardProduct';

const cx = classNames.bind(styles)

function SanPham() {
    const fetchProductAll = async () => {

        const res = await ProductService.getAllProduct()
        console.log('res product ', res);
        return res
    }
    const { isPending, data, isPreviousData, } = useQuery({ queryKey: ['product'], queryFn: fetchProductAll, retry: 3, retryDelay: 1000, keepPreviousData: true })
    console.log('resss dtataa', data);
    return (
        <div className={cx('wrapper')}>

            <Loading isLoading={isPending}>
                <div className={cx('inner')}>
                    {
                        data?.data.map((item, index) => (
                            <CardProduct
                                listProduct={item}
                                key={index}
                            ></CardProduct>
                        ))
                    }


                </div>
            </Loading>
        </div>
    );
}

export default SanPham;