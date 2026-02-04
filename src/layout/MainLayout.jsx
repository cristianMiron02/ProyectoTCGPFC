import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout() {
    return (
        <>
            <Header />
            <main className = "container py-4">
                <Oulet/>
            </main>
            <Footer />
        </>
    );
}