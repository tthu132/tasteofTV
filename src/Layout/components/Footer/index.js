import styles from './Footer.module.scss'
import classNames from 'classnames/bind';

const cx = classNames.bind(styles)


function Footer() {
  return (
    <header className={cx('wrapper')}>
      <div className={cx('inner')}>
        <h2>Footer</h2>


      </div>
    </header>
  );
}

export default Footer;