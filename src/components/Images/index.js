import styles from './Images.module.scss'

import { forwardRef, useState } from 'react'
import image from '~/images'

console.log(image.noImages);

function Images({ src, ...props }) {

    const [fallback, setFallback] = useState('')

    const handleErro = () => {
        setFallback(image.noImages)
    }

    return (
        <img {...props} src={fallback || src} onError={handleErro}></img>
    );
}

export default Images;