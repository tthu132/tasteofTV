import styles from './SidebarAccount.module.scss'
import classNames from 'classnames/bind';
import Menu, { MenuItem, MenuAccount } from '../../../components/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faUser, faTableCells } from '@fortawesome/free-solid-svg-icons';


const cx = classNames.bind(styles)

function SidebarAccount() {
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
          <MenuAccount menuAccount icon={faUser} title='Thông tin tài khoản' to='/taikhoan/edit'>
            {/* <FontAwesomeIcon icon={faUser}></FontAwesomeIcon> */}
          </MenuAccount>
          <MenuAccount menuAccount icon={faTableCells} title='Quản lý đơn hàng' to='/taikhoan/donhang'></MenuAccount>
          <MenuAccount menuAccount title='Đánh giá' to='/taikhoan/donhang'></MenuAccount>




        </Menu>
      </div>
    </aside>
  );
}

export default SidebarAccount;