import styles from './Header.module.scss'
import classNames from 'classnames/bind';
import logo from '~/images/logo/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCartShopping, faCircleUser, faHeart, faMagnifyingGlass, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Wrapper as PopperWrapper } from '~/components/Popper';
import Button from '~/components/Button';
import Images from '~/components/Images';
import Search from '../Search';

const cx = classNames.bind(styles)

function Header() {
  const currentUser = {
    img: '',
    name: 'Thu Nguyen'
  }


  const [hoverUser, setHoverUser] = useState(false)

  const handleMouseOver = () => {
    setHoverUser(true);

  };

  const handleMouseOut = () => {


    setHoverUser(false);

  };


  return (
    <header className={cx('wrapper')}>
      <div className={cx('inner')}>

        <div className={cx('header-left')}>
          <Link to='/'><img src={logo}></img></Link>
          <Search></Search>


        </div>

        <div className={cx('header-right')}>
          <ul>
            <li>
              <button><FontAwesomeIcon className={cx('icon')} icon={faBell} /></button>
              <p>Thông Báo</p>
            </li>
            <li>
              <button><FontAwesomeIcon className={cx('icon')} icon={faHeart} /></button>
              <p>Yêu Thích</p>
            </li>
            <li>
              <button><FontAwesomeIcon className={cx('icon')} icon={faCartShopping} /></button>
              <p>Giỏ Hàng</p>
            </li>
            <li className={cx('icon-login')}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}>
              {/* <Button className={cx('icon')} to='/login' buttonLogin>Đăng Nhập</Button> */}
              {currentUser ?
                (
                  <Tippy
                    delay={[0, 700]}
                    className={cx('typpy-user')}
                    interactive
                    visible
                    placement='bottom-end'
                    appendTo={() => document.body}

                    render={
                      (attrs) => (

                        <div className={cx('acction-user')}

                          tabIndex="-1" {...attrs}>
                          {hoverUser && (
                            <PopperWrapper popperUserAccept >
                              <ul >
                                <li>
                                  <Button className={cx('icon', 'profile')} to='/login' buttonProfile>Xem Tài Khoản</Button>
                                </li>
                                <hr style={{ width: '100%', margin: '10px 0' }}></hr>
                                <li>
                                  <Button className={cx('icon', 'logout')} to='/login' buttonLogout>Đăng Xuất</Button>
                                </li>
                              </ul>
                            </PopperWrapper>
                          )}
                        </div>
                      )}>
                    <div className={cx('typpy-user-control')} >
                      {/* <button><FontAwesomeIcon className={cx('icon')} icon={faCircleUser} /></button> */}
                      <Images
                        className={cx('user-avatar')}
                        alt='Nguyen Thu'
                        src='https://tokyolife.vn/_next/image?url=https%3A%2F%2Fpm2ec.s3.ap-southeast-1.amazonaws.com%2Fcms%2F17053979911205027_512.jpg&w=2048&q=75'
                      >

                      </Images>
                      <p>{currentUser.name}</p>
                    </div>
                  </Tippy >
                ) : (

                  <Tippy
                    delay={[0, 700]}
                    className={cx('typpy-user')}
                    interactive
                    visible
                    placement='bottom-end'
                    appendTo={() => document.body}
                    render={
                      (attrs) => (

                        <div className={cx('acction-user')} tabIndex="-1" {...attrs}>
                          {hoverUser && (
                            <PopperWrapper popperUser>
                              <div>
                                <h5>Chào Mừng Quý Khách </h5>
                                <h5>Đến Với TasteOfTraVinh</h5>

                                <div>
                                  <p>Đăng nhập vào tài khoản của Quý Khách</p>
                                  <Button className={cx('icon', 'login')} to='/login' buttonLogin>Đăng Nhập</Button>
                                </div>

                                <hr style={{ width: '100%', margin: '10px 0' }}></hr>

                                <div>
                                  <p>Đăng kí thành viên</p>
                                  <Button className={cx('icon', 'register')} to='/login' btnRegister>Đăng Ký</Button>
                                </div>
                              </div>

                            </PopperWrapper>
                          )}
                        </div>
                      )}>
                    <div className={cx('typpy-user-control')}>
                      <button><FontAwesomeIcon className={cx('icon')} icon={faCircleUser} /></button>
                      <p>Tài Khoản</p>
                    </div>
                  </Tippy >
                )

              }
            </li>


          </ul>
        </div>

      </div >
    </header >
  );
}

export default Header;