import Products from "../Products";
import styles from './Cardproduct.module.scss'
import classNames from "classnames/bind";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles)
function CardProduct({ listProduct }) {
    const navigate = useNavigate()
    const handleDetailsProduct = (id) => {
        console.log('idprodcut', id);
        // navigate(`/product/${id}`)
    }
    return (
        <div className={cx('wrapper')} onClick={() => handleDetailsProduct(listProduct._id)}>
            <Products data={listProduct}></Products>
            <Button btnAdd>Thêm Vào Giỏ Hàng</Button>

        </div>
    );
}

export default CardProduct;