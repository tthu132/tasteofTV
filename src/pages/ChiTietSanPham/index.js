import { useLocation, useParams } from 'react-router-dom';
import styles from './ChiTietSanPham.module.scss'
import classNames from 'classnames/bind';
import Images from '~/components/Images';
import Button from '~/components/Button';
import { useState, useEffect } from 'react';
import * as ProductService from '~/services/ProductService'
import { useQuery } from '@tanstack/react-query';
import * as ImageService from '~/services/ImageService'
import { useNavigate } from 'react-router-dom';
import FormLogin from '~/Layout/components/FormLogin';
import { useDispatch, useSelector } from 'react-redux'
import { addOrderProduct } from '~/redux/slice/orderSlice';

const cx = classNames.bind(styles)

function ChiTietSanPham() {

    const user = useSelector((state) => state.user)
    const [quality, setQuality] = useState(1)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const { id } = useParams();
    console.log('id nè', id);
    const fetchDetailProduct = async () => {
        const res = await ProductService.getDetailsProduct(id);

        return res.data
    }
    const { isPending, data: dataDetail } = useQuery({ queryKey: ['product-detail'], queryFn: fetchDetailProduct, enabled: !!id })
    console.log('productDetail ', dataDetail);

    const [imagelist, setImageList] = useState()

    useEffect(() => {
        const fetchImages = async () => {
            if (dataDetail?.idsImage?.length > 0) {
                const imageRequests = dataDetail.idsImage.map(async id => {
                    const res = await ImageService.getDetailsImage(id);
                    return res.data.image;
                });
                const images = await Promise.all(imageRequests);
                setImageList(images);
            }
        };

        fetchImages();


    }, [dataDetail]);
    function formatCurrency(number) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    }

    const handleOrderAdd = () => {
        console.log('jedheu');
        if (!user?.id) {
            navigate('/login', { state: location?.pathname })
        } else {
            console.log('dispatch ', {
                name: dataDetail?.name,
                amount: quality,
                image: imagelist[0],
                price: dataDetail?.price,
                product: dataDetail?._id
            });
            dispatch(addOrderProduct({
                orderItem: {
                    name: dataDetail?.name,
                    amount: quality,
                    image: imagelist[0],
                    price: dataDetail?.price,
                    product: dataDetail?._id,
                    countInstock: dataDetail?.countInStock
                }

            }))

        }

    }
    return (
        <>
            <h4><span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Trang Chủ</span> - <span>Chi tiết sản phẩm</span></h4>
            <div className={cx('wrapper')}>

                <div className={cx('wrapper-image')}>
                    <Images src={imagelist && imagelist[0]}></Images>

                    {
                        imagelist && <ul>
                            {
                                imagelist.map((item, index) => (
                                    <li key={index}>
                                        <Images src={item} />
                                    </li>
                                ))
                            }
                        </ul>
                    }
                </div>

                <div className={cx('wrapper-content')}>

                    <h2>{dataDetail?.name}</h2>
                    <h1>{formatCurrency(dataDetail?.price)}</h1>
                    <p>Mô tả: {dataDetail?.description}</p>
                    <p>Số lượng còn lại: {dataDetail?.countInStock}</p>

                    <div className={cx('buy')}>
                        <div className={cx('button-quality')}>
                            <Button btnQuality onClick={() => { quality > 0 && setQuality(quality - 1) }}>-</Button>
                            <Button btnControl ><input className={cx('btnContronl')} value={quality}></input></Button>
                            <Button btnQuality onClick={() => { quality < dataDetail?.countInStock && setQuality(quality + 1) }}>+</Button>

                        </div>
                        <Button onClick={handleOrderAdd} btnAdd>Thêm vào giỏ hàng</Button>


                    </div>

                </div>

            </div>
        </>
    );
}

export default ChiTietSanPham;