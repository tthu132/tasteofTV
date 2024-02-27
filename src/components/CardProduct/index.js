import Products from "../Products";
import styles from './Cardproduct.module.scss'
import classNames from "classnames/bind";
import Button from "../Button";

const cx = classNames.bind(styles)
function CardProduct({ listProduct }) {
    return (
        <div className={cx('wrapper')}>
            <Products data={listProduct}></Products>
            <Button btnAdd>Thêm Vào Giỏ Hàng</Button>

        </div>
    );
}

export default CardProduct;