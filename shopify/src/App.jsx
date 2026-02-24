import { useEffect } from "react";
import { getUsers } from "./api/userapi";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import AutoScrollCards from "./components/AutoScrollCards";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  useEffect(() => {
    getUsers()
      .then(console.log)
      .catch(console.error);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <div className="app">
            <Header />
            {/* <AutoScrollCards /> */}
            <main className="main-content">
              <ProductGrid />
            </main>
            <Footer />
          </div>
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;