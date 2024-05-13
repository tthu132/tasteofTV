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
import useAlan from '~/hooks/useAlan';
import { useCart } from '~/context/CartConText'
import { selectedOrder } from '~/redux/slice/orderSlice';
import { ThunderboltFilled, } from "@ant-design/icons";
import ProductSlider from "~/components/ProductSlider";


const cx = classNames.bind(styles)

function ChiTietSanPham() {
    const { test, handleOrderAdd1, handleOrderAdd2, stateUserDetail1 } = useCart()

    const user = useSelector((state) => state.user)
    const [quality, setQuality] = useState(1)
    const [checked, setChecked] = useState(0)
    const [isLoadingImage, setIsLoadingImage] = useState(true);
    const [stateCard, setStateCard] = useState({
        user: '',
        product: '',
        amount: ''

    })

    const [listChecked, setListChecked] = useState([])


    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [limit, setLimit] = useState(8)

    const { id } = useParams();
    const fetchDetailProduct = async () => {
        const res = await ProductService.getDetailsProduct(id);

        return res.data
    }


    const { isPending, data: dataDetail } = useQuery({ queryKey: ['product-detail'], queryFn: fetchDetailProduct, enabled: !!id })
    // const fetchProductAll = async (context) => {

    //     const limit = context?.queryKey && context?.queryKey[1]
    //     const res = await ProductService.getAllProduct(null, limit)
    //     return res
    // }
    // const { isPending: pendingall, data: dataall, isPreviousData, } = useQuery({ queryKey: ['product', limit], queryFn: fetchProductAll, retry: 3, retryDelay: 1000, keepPreviousData: true })

    const [imagelist, setImageList] = useState()

    useEffect(() => {
        const fetchImages = async () => {
            setIsLoadingImage(true);
            if (dataDetail?.idsImage?.length > 0) {
                const imageRequests = dataDetail.idsImage.map(async id => {
                    const res = await ImageService.getDetailsImage(id);
                    return res?.data?.image;
                });
                const images = await Promise.all(imageRequests);
                setImageList(images);
                setIsLoadingImage(false);
            }
        };

        localStorage.setItem('itemAdd', JSON.stringify(dataDetail));


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
        if (!user?.id) {
            navigate('/login', { state: location?.pathname })
        } else {
            // handleOrderAdd1(quality, dataDetail)
            if (quality > dataDetail?.countInStock) {
                message.error('Không đủ số lượng! Vui lòng giảm số lượng.')
                return false
                // navigate('/login', { state: location?.pathname })
            } else {

                mutation.mutate({ amount: quality, product: dataDetail?._id, user: user.id })
                dispatch(addOrderProduct({
                    orderItem: {
                        discount: dataDetail?.discount,

                        name: dataDetail?.name,
                        amount: quality,
                        image: dataDetail?.firstImage,
                        price: dataDetail?.price,
                        product: dataDetail?._id,
                        countInstock: dataDetail?.countInStock,
                    }

                }))
                message.success('Đã thêm vào giỏ hàng !!');


            }
        }

    }
    const handleOrderAdd3 = () => {

        if (!user?.id) {
            navigate('/login', { state: location?.pathname })
        } else {
            handleOrderAdd2(quality, dataDetail)

            navigate('/payment')

        }
    }
    return (
        <>
            <Loading isLoading={isPending || isLoadingImage}>
                <h4><span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Trang Chủ</span> - <span>Chi tiết sản phẩm</span></h4>
                <div className={cx('wrapper')}>

                    <div className={cx('wrapper-image')}>
                        <div className={cx('vedet')}><Images imageDetail src={imagelist && imagelist[checked]}></Images></div>

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
                        {/* <h1 className={cx('price')}>{formatCurrency(dataDetail?.price)}</h1> */}
                        {
                            dataDetail?.discount ?
                                <div >
                                    <p style={{ fontSize: '22px', marginTop: '10px' }} className={cx('old-price')}>{formatCurrency(dataDetail?.price)}</p>
                                    <h1 className={cx('price')}>{formatCurrency(dataDetail.price - (dataDetail?.price * dataDetail?.discount) / 100)}</h1>
                                </div> : <h1 className={cx('price')}>{formatCurrency(dataDetail?.price)}</h1>
                        }
                        {
                            dataDetail?.donvi ?
                                <p><b>Đơn vị tính: </b> {dataDetail?.donvi}</p> : <></>
                        }
                        <p style={{ margin: '10px 0' }}><b>Đã bán: </b>{dataDetail?.selled}</p>

                        <p><b>Số lượng còn lại: </b>{dataDetail?.countInStock}</p>
                        {
                            dataDetail?.exp && <p style={{ margin: '10px 0' }}><b>Hạn sử dụng: </b>{dataDetail?.exp}</p>
                        }
                        <p><b>Mô tả:</b> {dataDetail?.description}</p>




                        <div className={cx('buy')}>
                            <div className={cx('button-quality')}>
                                <Button btnQuality onClick={() => { quality > 1 && setQuality(quality - 1) }}>-</Button>
                                <Button btnControl ><input className={cx('btnContronl')} value={quality}></input></Button>
                                <Button btnQuality onClick={() => { quality < dataDetail?.countInStock && setQuality(quality + 1) }}>+</Button>

                            </div>
                            <div className={cx('action')} >
                                <Button onClick={handleOrderAdd} btnAdd>Thêm vào giỏ hàng</Button>
                                <Button onClick={handleOrderAdd3} btnBuy>MUA NGAY</Button>
                            </div>



                        </div>

                    </div>

                </div>
                {/* {
                    dataall && <div className={cx('box-sale')} >
                        <div className={cx('title')}>
                            <ThunderboltFilled style={{ color: 'gold', fontSize: '36px', margin: '5px' }} />
                            <h4>Siêu giảm giá</h4>
                        </div>
                        <ProductSlider products={dataall?.data} />
                    </div>
                } */}
            </Loading>
        </>
    );
}

export default ChiTietSanPham;