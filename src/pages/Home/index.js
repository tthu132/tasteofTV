import SliderComponent from "~/components/Silder";
import images from "~/images";
import classNames from "classnames/bind";
import styles from './Home.module.scss'
import BoxCategory from "~/components/BoxCategory";
import CardProduct from "~/components/CardProduct";
import ItemCategory from "~/components/ItemCategory";
import * as ProductService from '~/services/ProductService'
import { useQuery } from '@tanstack/react-query'




const cx = classNames.bind(styles)
function Home() {

    const fetchProductAll = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }

    const { isLoading, data } = useQuery({ queryKey: ['product'], queryFn: fetchProductAll, retry: 3, retryDelay: 1000 })
    console.log('data tu query ', data);
    const arrCategogy = [
        { title: 'Sản Phẩm Chế Biến', src: '/sanphamchebien', imageCategory: 'https://tokyolife.vn/_next/image?url=https%3A%2F%2Fpm2ec.s3.ap-southeast-1.amazonaws.com%2Fcms%2F17007233280237472_512.jpg&w=1200&q=75' },
        { title: 'Nông Sản', src: '/nongsan', imageCategory: 'https://tokyolife.vn/_next/image?url=https%3A%2F%2Fpm2ec.s3.ap-southeast-1.amazonaws.com%2Fcms%2F17007233280237472_512.jpg&w=1200&q=75' }
    ]
    const titleCategory = {
        title: 'Danh mục sản phẩm',
        src: '/',
        arrCategogy
    }
    const listProduct = [
        { full_name: 'Dừa sáp', price: 79000, avatar: 'https://tokyolife.vn/_next/image?url=https%3A%2F%2Fpm2ec.s3.ap-southeast-1.amazonaws.com%2Fcms%2F17007233280237472_512.jpg&w=1200&q=75' },
        { full_name: 'Dừa sáp', price: 79000, avatar: 'https://tokyolife.vn/_next/image?url=https%3A%2F%2Fpm2ec.s3.ap-southeast-1.amazonaws.com%2Fcms%2F17007233280237472_512.jpg&w=1200&q=75' },
        { full_name: 'Dừa sáp', price: 79000, avatar: 'https://tokyolife.vn/_next/image?url=https%3A%2F%2Fpm2ec.s3.ap-southeast-1.amazonaws.com%2Fcms%2F17007233280237472_512.jpg&w=1200&q=75' },
        { full_name: 'Dừa sáp', price: 79000, avatar: 'https://tokyolife.vn/_next/image?url=https%3A%2F%2Fpm2ec.s3.ap-southeast-1.amazonaws.com%2Fcms%2F17007233280237472_512.jpg&w=1200&q=75' },
        { full_name: 'Dừa sáp', price: 79000, avatar: 'https://tokyolife.vn/_next/image?url=https%3A%2F%2Fpm2ec.s3.ap-southeast-1.amazonaws.com%2Fcms%2F17007233280237472_512.jpg&w=1200&q=75' },
        { full_name: 'Dừa sáp', price: 79000, avatar: 'https://tokyolife.vn/_next/image?url=https%3A%2F%2Fpm2ec.s3.ap-southeast-1.amazonaws.com%2Fcms%2F17007233280237472_512.jpg&w=1200&q=75' },
        { full_name: 'Dừa sáp', price: 79000, avatar: 'https://tokyolife.vn/_next/image?url=https%3A%2F%2Fpm2ec.s3.ap-southeast-1.amazonaws.com%2Fcms%2F17007233280237472_512.jpg&w=1200&q=75' },
        { full_name: 'Dừa sáp', price: 79000, avatar: 'https://tokyolife.vn/_next/image?url=https%3A%2F%2Fpm2ec.s3.ap-southeast-1.amazonaws.com%2Fcms%2F17007233280237472_512.jpg&w=1200&q=75' }
    ]
    console.log('arr category: ', titleCategory.arrCategogy.imageCategory);
    console.log('arr category: ', titleCategory.arrCategogy);


    return (
        <div className={cx('wrapper')} >
            <div>Home</div>
            <SliderComponent arrImages={[...images.slider]}></SliderComponent>

            <BoxCategory item={titleCategory}>
                {arrCategogy.map((item, index) => {
                    return (
                        <ItemCategory data={item}></ItemCategory>

                    )
                })}

            </BoxCategory>

            {arrCategogy.map((item, index) => {
                return (
                    <BoxCategory item={item} key={index}>
                        {data && data.data.map((item, index) => {
                            return (
                                <CardProduct listProduct={item} key={index}></CardProduct>
                            )
                        })}

                    </BoxCategory>
                )
            })}

        </div>
    );
}

export default Home;