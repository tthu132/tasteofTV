import styles from './SidebarAdmin.module.scss'
import classNames from 'classnames/bind';
import Menu, { MenuItem, MenuAdmin } from '../../../components/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faUser, faTableCells } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const cx = classNames.bind(styles)

function SidebarAdmin({ handleMenuClick }) {

  const [activeMenu, setActiveMenu] = useState('');



  const handleClick = (title) => {
    setActiveMenu(title);
    handleMenuClick(title); // Truyền title lên component cha khi click
  };
  return (
    <aside className={cx('wrapper')}>
      <div className={cx('inner')}>

        <div className={cx('name-user')}>
          <FontAwesomeIcon icon={faCircleUser} className={cx('icon-user')} />
          <label>
            <p>Tài khoản của</p>
            <h3>Thu Nguyễn</h3>
          </label>

        </div>

        <Menu menuAccountItem >
          <MenuAdmin
            menuAccount
            onClick={handleClick}
            icon={faUser}
            title='Thống kê'
            activeMenu={activeMenu}
          >
          </MenuAdmin>
          <MenuAdmin
            menuAccount
            onClick={handleClick}
            icon={faUser}
            title='Quản lý tài khoản'
            activeMenu={activeMenu}
          >
          </MenuAdmin>
          <MenuAdmin
            activeMenu={activeMenu}

            menuAccount
            onClick={handleClick}
            icon={faTableCells}
            title='Quản lý sản phẩm' >

          </MenuAdmin>
          <MenuAdmin
            activeMenu={activeMenu}

            menuAccount
            onClick={handleClick}
            icon={faTableCells}
            title='Quản lý Blog' >

          </MenuAdmin>
          <MenuAdmin
            activeMenu={activeMenu}

            menuAccount
            onClick={handleClick}
            title='Đánh giá' >

          </MenuAdmin>




        </Menu>
      </div>
    </aside>
  );
}

export default SidebarAdmin;