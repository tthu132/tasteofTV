import styles from './Header.module.scss'
import classNames from 'classnames/bind';
import logo from '~/images/logo/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCartShopping, faCircleUser, faHeart, faMagnifyingGlass, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import { Wrapper as PopperWrapper } from '~/components/Popper';
import Button from '~/components/Button';
import Images from '~/components/Images';
import Search from '../Search';
import { Badge, } from 'antd';
import { CloseOutlined } from '@ant-design/icons'

import FormLogin from '../FormLogin';
import FormRegister from '../FormRegister';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'

import * as UserService from '~/services/UserService'
import { resetUser } from '~/redux/slice/userSlide';
import { UseDispatch, useDispatch } from 'react-redux';
import * as CardService from '~/services/CardService'
import { useQuery } from '@tanstack/react-query';
import { updateOrderProduct } from '~/redux/slice/orderSlice';

const cx = classNames.bind(styles)


function Header() {
  const currentUser = useSelector((state) => state.user)
  const order = useSelector((state) => state.order)

  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [hoverUser, setHoverUser] = useState(false)
  const [showFormLogin, setShowFormLogin] = useState(false)
  const [showFormRegister, setShowFormRegister] = useState(false)


  const dispatch = useDispatch()



  useEffect(() => {
    setName(currentUser.name)
    console.log('curent ', currentUser);

    if (currentUser?.id) {
      const fetchCart = async () => {
        const res = await CardService.getCard(currentUser.id);
        console.log('datacart ', res.data);


        dispatch(updateOrderProduct({
          orderItem: res.data

        }))


        return res.data
      }

      fetchCart();
    } else {
      dispatch(updateOrderProduct({
        orderItem: ''

      }))
    }

  }, [currentUser.name])


  const handleMouseOver = () => {
    setHoverUser(true);

  };

  const handleMouseOut = () => {
    setHoverUser(false);

  };


  const handleCloseForm = () => {
    setShowFormLogin(false)
    setShowFormRegister(false)

  }

  const openLogin = () => {
    setShowFormRegister(!showFormRegister)
    setShowFormLogin(!showFormLogin)
  }

  const handleLogout = async () => {
    await UserService.logoutUser()
    localStorage.removeItem('access_token');
    dispatch(resetUser())

  }

  return (
    <header className={cx('wrapper')}>
      <div className={cx('inner')}>

        <div className={cx('header-left')}>
          <Link to='/'><img src={logo}></img></Link>
          <Search></Search>

          {/* <button onClick={() => setShowFormLogin(true)}>Show</button> */}

          {/* {showFormLogin && <div className={cx('overlay')} >

            <FormLogin
              className={cx('formDN')}
              handleCloseForm={handleCloseForm}
              openRegister={openLogin}>

            </FormLogin>


          </div>} */}

          {/* {showFormRegister && <div className={cx('overlay')} >

            <FormRegister
              className={cx('formDN')}
              handleCloseFormRegister={handleCloseForm}
              openLogin={openLogin}>

            </FormRegister>

          </div>} */}

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
            <li onClick={() => navigate('/order')}>
              <Badge count={order?.orderItems?.length} style={{ position: 'absolute', right: '5px', top: '10px' }}>
                <button><FontAwesomeIcon className={cx('icon')} icon={faCartShopping} /></button>
              </Badge>
              <p>Giỏ Hàng</p>
            </li>
            <li className={cx('icon-login')}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}>
              {/* <Button className={cx('icon')} to='/login' buttonLogin>Đăng Nhập</Button> */}
              {currentUser.name ?
                (
                  <Tippy
                    delay={[0, 700]}
                    className={cx('typpy-user')}
                    interactive
                    visible
                    placement="bottom-end" offset={[2, 2]}
                    appendTo={() => document.body}

                    render={
                      (attrs) => (

                        <div className={cx('acction-user')}

                          tabIndex="-1" {...attrs}>
                          {hoverUser && (
                            <PopperWrapper popperUserAccept >
                              <ul >
                                <li>
                                  <Button
                                    className={cx('icon', 'profile')}
                                    to='/taikhoan'
                                    buttonProfile >Xem Tài Khoản
                                  </Button>
                                </li>
                                <hr style={{ width: '100%', margin: '10px 0' }}></hr>
                                <li>
                                  <Button
                                    onClick={handleLogout}
                                    className={cx('icon', 'logout')}
                                    to='/'

                                    buttonLogout>Đăng Xuất
                                  </Button>
                                </li>
                                <li>
                                  <p
                                    onClick={() => navigate('/taikhoan/donhang', {
                                      state: {
                                        id: currentUser?.id,
                                        token: currentUser?.access_token
                                      }
                                    })}
                                    className={cx('icon', 'order')}

                                  >Đơn hàng của tôi
                                  </p>
                                </li>
                              </ul>
                            </PopperWrapper>
                          )}
                        </div>
                      )}>
                    <div className={cx('typpy-user-control')} >
                      {/* <button><FontAwesomeIcon className={cx('icon')} icon={faCircleUser} /></button> */}
                      <button >
                        {
                          currentUser.avatar ? (
                            <Images
                              src={currentUser.avatar}
                              className={cx('user-avatar')}

                            />
                          ) : (
                            <Images
                              className={cx('user-avatar')}
                              alt='Nguyen Thu'
                              src='https://tokyolife.vn/_next/image?url=https%3A%2F%2Fpm2ec.s3.ap-southeast-1.amazonaws.com%2Fcms%2F17053979911205027_512.jpg&w=2048&q=75'
                            >

                            </Images>
                          )
                        }
                      </button>
                      <p>{name}</p>
                    </div>
                  </Tippy >
                ) : (

                  <Tippy
                    delay={[0, 700]}
                    className={cx('typpy-user')}
                    interactive
                    visible
                    placement="bottom-end" offset={[2, 2]}
                    appendTo={() => document.body}
                    render={
                      (attrs) => (

                        <div className={cx('acction-user')} tabIndex="-1" {...attrs}>
                          {hoverUser && (
                            <div>
                              <PopperWrapper popperUser>
                                <div>
                                  <h5>Chào Mừng Quý Khách </h5>
                                  <h5>Đến Với TasteOfTraVinh</h5>

                                  <div>
                                    <p>Đăng nhập vào tài khoản của Quý Khách</p>
                                    <Button
                                      className={cx('icon', 'login')}
                                      buttonLogin
                                      onClick={() => navigate('/login')}
                                    // onClick={() => (setShowFormLogin(true), setHoverUser(false))}

                                    >Đăng Nhập</Button>
                                  </div>

                                  <hr style={{ width: '100%', margin: '10px 0' }}></hr>

                                  <div>
                                    <p>Đăng kí thành viên</p>
                                    <Button
                                      onClick={() => navigate('/register')}
                                      className={cx('icon', 'register')}

                                      btnRegister>Đăng Ký</Button>
                                  </div>
                                </div>

                              </PopperWrapper>
                            </div>
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