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
import ProductSlider from "~/components/ProductSlider";
import { ThunderboltFilled, } from "@ant-design/icons";


const cx = classNames.bind(styles)
function Home() {

    const [limit, setLimit] = useState(11)

    const fetchProductAll = async (context) => {

        const limit = context?.queryKey && context?.queryKey[1]
        const res = await ProductService.getAllProduct(null, limit)
        return res
    }
    const fetchCatoAll = async () => {
        const res = await ProductCategoryService.getAllProductCatogory()
        return res.data
    }

    const { isPending, data, isPreviousData, } = useQuery({ queryKey: ['product', limit], queryFn: fetchProductAll, retry: 3, retryDelay: 1000, keepPreviousData: true })
    const { isPending: isPendingCato, data: dataCato } = useQuery({ queryKey: ['catogory'], queryFn: fetchCatoAll, retry: 3, retryDelay: 1000 })

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
        setLimit(prevLimit => prevLimit + 10);
    };

    return (
        <Loading isLoading={false}>
            <div className={cx('wrapper')} >
                <div>
                    <BackTop />


                </div>
                {/* <div>Home</div> */}
                <SliderComponent arrImages={[...images.slider]}></SliderComponent>

                <div className={cx('box-sale')} >
                    <div className={cx('title')}>
                        <ThunderboltFilled style={{ color: 'gold', fontSize: '36px', margin: '5px' }} />
                        <h4>Siêu giảm giá</h4>
                    </div>
                    <ProductSlider products={data?.data} />
                </div>

                {/* <BoxCategory item={titleCategory}>
                {arrCategogy.map((item, index) => {
                    return (
                        <ItemCategory key={index} data={item}></ItemCategory>

                    )
                })}

            </BoxCategory> */}

                {dataCato && dataCato.map((categoryItem, categoryIndex) => {
                    // Lọc những sản phẩm có categoryName trùng với tên của danh mục sản phẩm
                    const filteredProducts = data && data?.data.filter(productItem => productItem?.categoryName === categoryItem?.name);

                    return (
                        <BoxCategory
                            onLoadMore={handleLoadMore}
                            item={categoryItem}
                            key={categoryIndex}
                            isLoading={isPending}
                            check={data?.total === data?.data?.length}
                        >
                            {filteredProducts?.map((productItem, productIndex) => {
                                return (
                                    <CardProduct
                                        listProduct={productItem}
                                        key={productIndex}
                                    ></CardProduct>
                                )
                            })}
                        </BoxCategory>
                    )
                })}

            </div>
        </Loading >
    );
}

export default Home;