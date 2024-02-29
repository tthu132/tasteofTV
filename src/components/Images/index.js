import styles from './Images.module.scss'
import classNames from 'classnames/bind';
import { forwardRef, useState } from 'react'
import image from '~/images'


const cx = classNames.bind(styles)

function Images({ ItemCategory, Product, Avatar, ProductAdmin, src, ...props }) {
    const classes = cx('wrapper', {
        Product,
        ItemCategory,
        Avatar, ProductAdmin

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