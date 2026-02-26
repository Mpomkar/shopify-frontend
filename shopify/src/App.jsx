import { useEffect } from "react";
import { getUsers } from "./api/userapi";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import AutoScrollCards from "./components/AutoScrollCards";
import ProductGrid from "./components/ProductGrid";
import SellerDashboard from "./components/SellerDashboard";
import Footer from "./components/Footer";
import "./App.css";

function AppContent() {
  const { userType } = useAuth();

  useEffect(() => {
    getUsers()
      .then(console.log)
      .catch(console.error);
  }, []);

  return (
    <div className="app">
      <Header />
      {/* <AutoScrollCards /> */}
      <main className="main-content">
        {userType === "seller" ? (
          <SellerDashboard />
        ) : (
          <ProductGrid />
        )}
      </main>
      {userType !== "seller" && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <AppContent />
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;