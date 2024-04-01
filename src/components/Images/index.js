import styles from './Images.module.scss'
import classNames from 'classnames/bind';
import { forwardRef, useState } from 'react'
import image from '~/images'


const cx = classNames.bind(styles)

function Images({ Total,imageSmallChecked,imageOrderList,noOrder, ItemCategory, imageSmall, Product, Avatar, ProductAdmin,logo, src, ...props }) {
    const classes = cx('wrapper', {
        Product,
        ItemCategory,
        Avatar, ProductAdmin, imageSmall,
        imageSmallChecked,
        noOrder,
        imageOrderList,
        logo,Total,
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