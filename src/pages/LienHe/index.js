import styles from './LienHe.module.scss'
import classNames from 'classnames/bind';
import logo from '~/images/logo/logo.png'
import { Link } from 'react-router-dom';
import { RightOutlined, ArrowRightOutlined } from "@ant-design/icons";
import images from '~/images';
import Images from '~/components/Images';



const cx = classNames.bind(styles)


function LienHe() {
    return (
        <div className={cx('wrapper')}>
            <div>
                <div className={cx('info')}>
                    <Link to='/'><img src={logo}></img></Link>

                    <p> <RightOutlined style={{ margin: '0 5px', color: '#55833D' }} />PHẢN ÁNH CHẤT LƯỢNG DỊCH VỤ</p>
                    <p> <RightOutlined style={{ margin: '0 5px', color: '#55833D' }} />HOTLINE: 0363320355</p>
                    <p> <RightOutlined style={{ margin: '0 5px', color: '#55833D' }} />EMAIL:thub2012151@gmail.com</p>
                    {/* <RightOutlined />
                     */}
                    <div className={cx('livechat')}>
                        <h3>Hoặc liên hệ với chúng tôi qua Live Chat</h3>
                        {/* <RightOutlined /><RightOutlined />
                         */}
                        <ArrowRightOutlined style={{ margin: '0 5px', color: '#55833D' }} />

                        <Images livechat src={images.livechat}></Images>
                    </div>
                </div>
                <div className={cx('hdsd')}>
                    <h2>Hướng dẫn sử dụng Trợ lý ảo mua sắm</h2>

                    <ul>
                        <li>
                            <p>Click vào mic <Images livechat src={images.mic}></Images> để nói ra yêu cầu</p>
                        </li>
                        <li style={{ padding: '30px 80px' }}>
                            <Images HDSD src={images.hd1}></Images>
                        </li>
                        <li>
                            <p>Ví dụ, quý khách muốn xem sản phẩm Cốm dẹp, quý khách bật mic và nói "Xem cốm dẹp"</p>

                        </li>
                        <li style={{ padding: '30px 80px' }}>
                            <Images HDSD src={images.hd2}></Images>
                        </li>
                        <li>
                            <p>Sản phẩm sẽ lập tức được hiển thị ra</p>
                        </li>
                        <li style={{ padding: '30px 80px' }}>
                            <Images HDSD src={images.hd3}></Images>
                        </li>
                    </ul>

                </div>


            </div>



        </div>
    );
}

export default LienHe;