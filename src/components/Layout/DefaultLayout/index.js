import Header from "../components/Header";
import Sidebar from "./Sidebar";
import Footer from "../components/Footer";

function DefaultLayout({ children }) {
    return (
        <div>
            <Header />
            <Sidebar />
            <div className="content">
                {children}
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;