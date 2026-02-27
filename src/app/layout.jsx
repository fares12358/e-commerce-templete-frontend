import Navbar from "@/Components/Navbar";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "@/Components/Footer";
export const metadata = {
  title: "E-Commerce",
  description: "E-Commerce Website",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`bg-gray-50 text-black`}
      >
        <AuthProvider>
          <Navbar />
          {children}
          <Footer/>
          <ToastContainer position="top-center" autoClose={3000} />
        </AuthProvider>
      </body>
    </html>
  );
}
