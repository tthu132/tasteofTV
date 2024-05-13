import styles from './Footer.module.scss'
import classNames from 'classnames/bind';
import logo from '~/images/logo/logo.png'
import { Link } from 'react-router-dom';


const cx = classNames.bind(styles)


function Footer() {
  return (
    <footer className={cx('wrapper')}>
      <div className={cx('inner')}>

        <div>
          <Link to='/'><img src={logo}></img></Link>

          <h3>Website kinh doanh đặc sản Trà Vinh</h3>
          <b>------------------------------------</b>

          <ul>
            <li>
              <b>Điện thoại: </b>0363320355
            </li>
            <li>
              <b>Email: </b>thub2012151@student.ctu.edu.vn
            </li>
            <li>
              <b>Địa chỉ: </b>Hẻm 359, Nguyễn Văn Cừ, An Hòa, Ninh Kiều, Cần Thờ
            </li>
          </ul>

        </div>
        <div>
          <h2>Về Chúng tôi</h2>
          <ul>
            <li>
              <b></b>Giới thiệu về Website
            </li>
            <li>
              <b></b>Lời hứa của chúng tôi
            </li>
            <li>
              <b></b>Câu chuyện thương hiệu
            </li>
            <li>
              <b></b>Cột mốc đáng nhớ
            </li>
          </ul>

        </div>
        <div>
          <h2>Sản phẩm</h2>
          <ul>
            <li>Sản phẩm chế biến</li>
            <li>Nông sản</li>
          </ul>

        </div>


      </div>
    </footer>
  );
}

export default Footer;