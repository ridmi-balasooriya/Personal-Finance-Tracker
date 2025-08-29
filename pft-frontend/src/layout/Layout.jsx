import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
    return(
        <div className="min-h-screen">
            <Header />
                <main>
                    {children}
                </main>
            <Footer />
        </div>
    )
}

export default Layout;