import Home from '~/pages/Home';
import SanPham from '~/pages/SanPham';
import LienHe from '~/pages/LienHe';
import TinTuc from '~/pages/TinTuc';
import TaiKhoan from '~/pages/TaiKhoan';
import Search from '~/pages/Search';
import ChiTietSanPham from '~/pages/ChiTietSanPham';

import { HeaderOnly } from '~/components/Layout';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/sanpham', component: SanPham },
    { path: '/lienhe', component: LienHe },
    { path: '/tintuc', component: TinTuc },
    { path: '/taikhoan', component: TaiKhoan, layout: HeaderOnly },
    { path: '/search', component: Search, layout: null },
    { path: '/:nickname', component: ChiTietSanPham, layout: null }





]
const privateRoute = [

]

export { publicRoutes, privateRoute }