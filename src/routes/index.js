import Home from '~/pages/Home';
import SanPham from '~/pages/SanPham';
import LienHe from '~/pages/LienHe';
import TinTuc from '~/pages/Blog';
import TaiKhoan from '~/pages/TaiKhoan';
import Search from '~/pages/Search';
import ChiTietSanPham from '~/pages/ChiTietSanPham';
import DangNhap from '~/pages/DangNhap';
import DangKy from '~/pages/DangKy';
import ThongTinTaiKhoan from '~/pages/TaiKhoan/ThongTinTaiKhoan';
import QuanLyDonHang from '~/pages/TaiKhoan/QuanLyDonHang';
import Admin from '~/pages/Admin';
import KetQuaTimKiem from '~/pages/KetQuaTimKiem';
import ProductType from '~/pages/ProductType';
import OrderPage from '~/pages/OderPage';
import Payment from '~/pages/Payment';
import OrderSuccess from '~/pages/OrderSuccess';
import MyOrder from '~/Layout/components/MyOrder';
import DetailOrder from '~/Layout/components/DetailOrder';

import { HeaderOnly } from '~/Layout';
import LayoutAdmin from '~/Layout/LayoutAdmin';


const publicRoutes = [
    { path: '/', component: Home },
    { path: '/sanpham', component: SanPham },
    { path: '/lienhe', component: LienHe },
    { path: '/tintuc', component: TinTuc },
    { path: '/taikhoan', component: TaiKhoan, layout: HeaderOnly },
    { path: '/search', component: Search, layout: null },
    { path: '/product/:id', component: ChiTietSanPham },
    { path: '/login', component: DangNhap, layout: null },
    { path: '/register', component: DangKy, layout: null },
    { path: '/ketquatimkiem/:key', component: KetQuaTimKiem },
    { path: '/type/:key', component: ProductType },
    { path: '/order', component: OrderPage },
    { path: '/payment', component: Payment },
    { path: '/ordersuccess', component: OrderSuccess },



    { path: '/my-order', component: MyOrder, layout: HeaderOnly },
    { path: '/detail-order/:id', component: DetailOrder, layout: HeaderOnly },

    { path: '/taikhoan/edit', component: ThongTinTaiKhoan, layout: HeaderOnly },
    { path: '/taikhoan/donhang', component: QuanLyDonHang, layout: HeaderOnly },
]
const privateRoute = [
    { path: '/admin', component: Admin, layout: LayoutAdmin },
]

export { publicRoutes, privateRoute }