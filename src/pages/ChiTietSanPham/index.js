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
import Loading from '~/components/Loading';
import * as CardService from '~/services/CardService'
import { useMutationHook } from '~/hooks/useMutationHook';
import * as message from '~/components/Message'

const cx = classNames.bind(styles)

function ChiTietSanPham() {

    const user = useSelector((state) => state.user)
    const [quality, setQuality] = useState(1)
    const [checked, setChecked] = useState(0)
    const [isLoadingImage, setIsLoadingImage] = useState(true);
    const [stateCard, setStateCard] = useState({
        user: '',
        product: '',
        amount: ''

    })


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
            setIsLoadingImage(true);
            if (dataDetail?.idsImage?.length > 0) {
                const imageRequests = dataDetail.idsImage.map(async id => {
                    const res = await ImageService.getDetailsImage(id);
                    return res.data.image;
                });
                const images = await Promise.all(imageRequests);
                setImageList(images);
                setIsLoadingImage(false);
            }
        };

        fetchImages();


    }, [dataDetail]);
    function formatCurrency(number) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    }
    const mutation = useMutationHook(
        (data) => {
            CardService.createCard(data)
        }
    )
    const { data, isSuccess, isError, isPending: isPendingCard } = mutation
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
                product: dataDetail?._id,
                discount: dataDetail?.discount
            });
            mutation.mutate({ amount: quality, product: dataDetail?._id, user: user.id })
            dispatch(addOrderProduct({
                orderItem: {
                    name: dataDetail?.name,
                    amount: quality,
                    image: imagelist[0],
                    price: dataDetail?.price,
                    product: dataDetail?._id,
                    countInstock: dataDetail?.countInStock
                    ,
                    discount: dataDetail?.discount
                }

            }))
            message.success('Đã thêm vào giỏ hàng !!');

        }

    }
    return (
        <>
            <Loading isLoading={isPending || isLoadingImage}>
                <h4><span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Trang Chủ</span> - <span>Chi tiết sản phẩm</span></h4>
                <div className={cx('wrapper')}>

                    <div className={cx('wrapper-image')}>
                        <div className={cx('vedet')}><Images src={imagelist && imagelist[checked]}></Images></div>

                        {
                            imagelist && <ul>
                                {
                                    imagelist.map((item, index) => (
                                        <li key={index} onClick={() => setChecked(index)} >
                                            <Images imageSmall imageSmallChecked={checked === index ? true : false} src={item} />
                                        </li>
                                    ))
                                }
                            </ul>
                        }
                    </div>

                    <div className={cx('wrapper-content')}>

                        <h2>{dataDetail?.name}</h2>
                        <h1 className={cx('price')}>{formatCurrency(dataDetail?.price)}</h1>
                        <p><b>Số lượng còn lại: </b>{dataDetail?.countInStock}</p>
                        <p><b>Mô tả:</b> {dataDetail?.description}</p>


                        <div className={cx('buy')}>
                            <div className={cx('button-quality')}>
                                <Button btnQuality onClick={() => { quality > 1 && setQuality(quality - 1) }}>-</Button>
                                <Button btnControl ><input className={cx('btnContronl')} value={quality}></input></Button>
                                <Button btnQuality onClick={() => { quality < dataDetail?.countInStock && setQuality(quality + 1) }}>+</Button>

                            </div>
                            <Button onClick={handleOrderAdd} btnAdd>Thêm vào giỏ hàng</Button>


                        </div>

                    </div>

                </div>
            </Loading>
        </>
    );
}

export default ChiTietSanPham;