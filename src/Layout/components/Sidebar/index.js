import styles from './Sidebar.module.scss'
import classNames from 'classnames/bind';
import Menu, { MenuItem } from '../../../components/Menu';

const cx = classNames.bind(styles)

function Sidebar() {
  return (
    <aside className={cx('wrapper')}>
      <div className={cx('inner')}>

        <Menu>
          <MenuItem activeHome title='Trang Chủ' to='/'></MenuItem>
          <MenuItem activeHome title='Sản Phẩm' to='/sanpham'></MenuItem>

          <MenuItem activeHome title='Liên Hệ' to='/lienhe'></MenuItem>
          <MenuItem activeHome title='Blog' to='/tintuc'></MenuItem>

        </Menu>
      </div>
    </aside>
  );
}

export default Sidebar;