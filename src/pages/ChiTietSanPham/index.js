import { useParams } from 'react-router-dom';
import styles from './ChiTietSanPham.module.scss'
import classNames from 'classnames/bind';
import Images from '~/components/Images';
import Button from '~/components/Button';
import { useState } from 'react';

const cx = classNames.bind(styles)

function ChiTietSanPham() {

    const [quality, setQuality] = useState(0)
    console.log('quality ', quality);

    const { full_name } = useParams();
    console.log('id nè', { full_name });
    return (
        <div className={cx('wrapper')}>

            <div className={cx('wrapper-image')}>
                <Images src={'https://tokyolife.vn/_next/image?url=https%3A%2F%2Fpm2ec.s3.ap-southeast-1.amazonaws.com%2Fcms%2F17007145512656562.jpg&w=1200&q=75'}></Images>
            </div>

            <div className={cx('wrapper-content')}>

                <div className={cx('buy')}>
                    <div className={cx('button-quality')}>
                        <Button btnQuality onClick={() => { quality > 0 && setQuality(quality - 1) }}>-</Button>
                        <Button btnControl ><input className={cx('btnContronl')} value={quality}></input></Button>
                        <Button btnQuality onClick={() => setQuality(quality + 1)}>+</Button>

                    </div>


                </div>

            </div>

        </div>
    );
}

export default ChiTietSanPham;