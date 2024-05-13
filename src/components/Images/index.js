import styles from './Images.module.scss'
import classNames from 'classnames/bind';
import { forwardRef, useState } from 'react'
import image from '~/images'


const cx = classNames.bind(styles)

function Images({ AvatarSmall, imageDetail, HDSD, livechat, Total, AvatarComment, test, imageSmallChecked, Small, imageOrderList, noOrder, ItemCategory, imageSmall, Product, Avatar, ProductAdmin, logo, src, ...props }) {
    const classes = cx('wrapper', {
        imageDetail,
        AvatarSmall,
        HDSD,
        livechat,
        Product,
        ItemCategory,
        Avatar, ProductAdmin, imageSmall,
        imageSmallChecked,
        noOrder,
        imageOrderList,
        logo, Total, Small, AvatarComment,
        test
    })


    const [fallback, setFallback] = useState('')

    const handleErro = () => {
        setFallback(image.noImages)
    }

    return (
        <img loading="lazy" className={classes} {...props} src={fallback || src} onError={handleErro}></img>
    );
}

export default Images;