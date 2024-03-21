import SliderComponent from "~/components/Silder";
import images from "~/images";
import classNames from "classnames/bind";
import styles from './Home.module.scss'
import BoxCategory from "~/components/BoxCategory";
import CardProduct from "~/components/CardProduct";
import ItemCategory from "~/components/ItemCategory";
import * as ProductService from '~/services/ProductService'
import { useQuery } from '@tanstack/react-query'
import { BackTop } from 'antd';

import * as ProductCategoryService from '~/services/ProductCatogoryService '
import { useState } from "react";
import Loading from "~/components/Loading";




const cx = classNames.bind(styles)
function Home() {

    const [limit, setLimit] = useState(6)

    const fetchProductAll = async (context) => {

        const limit = context?.queryKey && context?.queryKey[1]
        console.log('limit 1 ', limit);
        const res = await ProductService.getAllProduct(null, limit)
        return res
    }
    const fetchCatoAll = async () => {
        const res = await ProductCategoryService.getAllProductCatogory()
        console.log('rescato ', res.data);
        return res.data
    }

    const { isPending, data, isPreviousData, } = useQuery({ queryKey: ['product', limit], queryFn: fetchProductAll, retry: 3, retryDelay: 1000, keepPreviousData: true })
    const { isPending: isPendingCato, data: dataCato } = useQuery({ queryKey: ['catogory'], queryFn: fetchCatoAll, retry: 3, retryDelay: 1000 })

    console.log('total ', data);
    const arrCategogy = [
        { title: 'Sản Phẩm Chế Biến', src: '/sanphamchebien', imageCategory: 'https://tokyolife.vn/_next/image?url=https%3A%2F%2Fpm2ec.s3.ap-southeast-1.amazonaws.com%2Fcms%2F17007233280237472_512.jpg&w=1200&q=75' },
        { title: 'Nông Sản', src: '/nongsan', imageCategory: 'https://tokyolife.vn/_next/image?url=https%3A%2F%2Fpm2ec.s3.ap-southeast-1.amazonaws.com%2Fcms%2F17007233280237472_512.jpg&w=1200&q=75' }
    ]
    const titleCategory = {
        title: 'Danh mục sản phẩm',
        src: '/',
        arrCategogy
    }


    const handleLoadMore = () => {
        setLimit(prevLimit => prevLimit + 6);
    };

    return (
        <Loading isLoading={isPending}>
            <div className={cx('wrapper')} >
                <div>
                    <BackTop />


                </div>
                <div>Home</div>
                <SliderComponent arrImages={[...images.slider]}></SliderComponent>

                {/* <BoxCategory item={titleCategory}>
                {arrCategogy.map((item, index) => {
                    return (
                        <ItemCategory key={index} data={item}></ItemCategory>

                    )
                })}

            </BoxCategory> */}

                {dataCato && dataCato.map((item, index) => {
                    return (

                        <BoxCategory
                            onLoadMore={handleLoadMore}
                            item={item}
                            key={index}
                            isLoading={isPending}
                            check={data?.total === data?.data?.length}
                        >
                            {data && data.data.map((item, index) => {
                                return (
                                    <CardProduct
                                      
                                        listProduct={item}
                                        key={index}></CardProduct>
                                )
                            })}

                        </BoxCategory>

                    )
                })}

            </div>
        </Loading>
    );
}

export default Home;