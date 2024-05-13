import Products from "../Products";
import styles from './Cardproduct.module.scss'
import classNames from "classnames/bind";
import Button from "../Button";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { addOrderProduct } from '~/redux/slice/orderSlice';
import { useState, useEffect } from 'react';
import * as ImageService from '~/services/ImageService'
import * as CardService from '~/services/CardService'
import { useMutationHook } from '~/hooks/useMutationHook';
import * as message from '~/components/Message'

const cx = classNames.bind(styles)
function CardProduct({ listProduct }) {
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)

    const [imagelist, setImageList] = useState()


    const handleDetailsProduct = (id) => {
        // navigate(`/product/${id}`)
    }
    useEffect(() => {
        const fetchImages = async () => {
            if (listProduct?.idsImage?.length > 0) {
                const imageRequests = listProduct?.idsImage.map(async id => {
                    const res = await ImageService.getDetailsImage(id);
                    return res.data?.image;
                });
                const images = await Promise.all(imageRequests);
                setImageList(images);
            }
        };

        fetchImages();


    }, [listProduct]);
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

            if (imagelist && imagelist.length > 0) {
                console.log('dispatch ', {
                    name: listProduct?.name,
                    amount: 1,
                    image: imagelist[0],
                    price: listProduct?.price,
                    product: listProduct?._id,
                    discount: listProduct?.discount
                });
                mutation.mutate({ amount: 1, product: listProduct?._id, user: user.id })
                dispatch(addOrderProduct({
                    orderItem: {
                        name: listProduct?.name,
                        amount: 1,
                        image: imagelist[0],
                        price: listProduct?.price,
                        product: listProduct?._id,
                        countInstock: listProduct?.countInStock,
                        discount: listProduct?.discount
                    }
                }))
                message.success('Đã thêm vào giỏ hàng !!');
            }


        }
    }
    return (
        <div className={cx('wrapper')} onClick={() => handleDetailsProduct(listProduct._id)}>
            <Products data={listProduct}></Products>
            <Button btnAdd onClick={handleOrderAdd} >Thêm Vào Giỏ Hàng</Button>

        </div>
    );
}

export default CardProduct;