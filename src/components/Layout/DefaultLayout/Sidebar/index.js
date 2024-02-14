import styles from './Sidebar.module.scss'
import classNames from 'classnames/bind';

const cx = classNames.bind(styles)

function Sidebar() {
  return (
    <aside className={cx('wrapper')}>
      <div className={cx('inner')}><h2>Sidebar</h2></div>
    </aside>
  );
}

export default Sidebar;