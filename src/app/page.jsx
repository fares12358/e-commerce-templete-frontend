"use client"
import AdsSlider from "@/Components/AdsSlider";
import CategorySlider from "@/Components/CategorySlider";
import Loader from "@/Components/Loader";
import ProductCard from "@/Components/ProductCard";
import SearchBar from "@/Components/SearchBar";
import CartSidePanel from "@/Components/CartSidePanel";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Home() {
  const { setupData, setupLoading } = useAuth();

  const [open, setOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  if (setupLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader size={40} color="#000" />
      </div>
    )
  }

  const openCart = (product) => {
    setActiveProduct(product);
    setOpen(true);
  };
  
  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-4 py-12">
        <SearchBar />
        <AdsSlider />
        <CategorySlider />

        <h2 className="text-2xl font-bold mb-6">المنتجات المميزة</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {setupData?.featuredProducts.map(item => (
            <ProductCard
              key={item._id}
              id={item._id}
              title={item.name}
              price={item.price}
              image={item.images[0].url}
              stock={item.stock}
              code={item.productNumber}
              comparePrice={item.comparePrice}
              category={item?.categoryId?.name}
              onAdd={() => openCart(item)}
            />
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6 mt-16">
          المنتجات المضافة حديثا
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {setupData?.newProducts.map(item => (
            <ProductCard
              key={item._id}
              id={item._id}
              title={item.name}
              price={item.price}
              image={item.images[0].url}
              stock={item.stock}
              code={item.productNumber}
              comparePrice={item.comparePrice}
              category={item?.categoryId?.name}
              onAdd={() => openCart(item)}
            />
          ))}
        </div>
      </section>

      {/* ✅ SINGLE GLOBAL SLIDER */}
      {activeProduct && (
        <CartSidePanel
          open={open}
          onClose={() => { setOpen(false); setActiveProduct(null) }}
          selections={activeProduct.selections}
          id={activeProduct._id}
          name={activeProduct.name}
          stock={activeProduct.stock}
          price={activeProduct.price}
          comparePrice={activeProduct.comparePrice}
          image={activeProduct.images[0].url}
        />
      )}
    </main>
  );
}
