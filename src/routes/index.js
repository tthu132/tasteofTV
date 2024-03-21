import Home from '~/pages/Home';
import SanPham from '~/pages/SanPham';
import LienHe from '~/pages/LienHe';
import TinTuc from '~/pages/TinTuc';
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

import { HeaderOnly } from '~/Layout';

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





    { path: '/taikhoan/edit', component: ThongTinTaiKhoan, layout: HeaderOnly },
    { path: '/taikhoan/donhang', component: QuanLyDonHang, layout: HeaderOnly },



]
const privateRoute = [
    { path: '/admin', component: Admin, layout: null },

]

export { publicRoutes, privateRoute }