import styles from './SidebarAccount.module.scss'
import classNames from 'classnames/bind';
import Menu, { MenuItem, MenuAccount } from '../../../components/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faUser, faTableCells, faPenSquare } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import Images from '~/components/Images';


const cx = classNames.bind(styles)

function SidebarAccount() {
  const user = useSelector((state) => state.user)

  return (
    <aside className={cx('wrapper')}>
      <div className={cx('inner')}>

        <div className={cx('name-user')}>
          {
            user?.avatar ? <Images AvatarSmall src={user?.avatar}></Images> : <FontAwesomeIcon icon={faCircleUser} className={cx('icon-user')} />
          }
          {/* <FontAwesomeIcon icon={faCircleUser} className={cx('icon-user')} />
          <Images AvatarSmall src={user?.avatar}></Images> */}
          <label>
            <p>Tài khoản của</p>
            <h3>{user?.name}</h3>
          </label>

        </div>

        <Menu menuAccountItem >
          <MenuAccount menuAccount icon={faUser} title='Thông tin tài khoản' to='/taikhoan/edit'>
            {/* <FontAwesomeIcon icon={faUser}></FontAwesomeIcon> */}
          </MenuAccount>
          <MenuAccount menuAccount icon={faTableCells} title='Quản lý đơn hàng' to='/taikhoan/donhang'></MenuAccount>
          <MenuAccount menuAccount icon={faPenSquare} title='Đánh giá' to='/taikhoan/danhgia'></MenuAccount>




        </Menu>
      </div>
    </aside>
  );
}

export default SidebarAccount;