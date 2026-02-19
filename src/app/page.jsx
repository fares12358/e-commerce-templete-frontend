"use client"
import AdsSlider from "@/Components/AdsSlider";
import CategorySlider from "@/Components/CategorySlider";
import Loader from "@/Components/Loader";
import ProductCard from "@/Components/ProductCard";
import SearchBar from "@/Components/SearchBar";
import CartSidePanel from "@/Components/CartSidePanel";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { FaBoxOpen, FaStar } from "react-icons/fa";

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
        {
          setupData?.featuredProducts &&
          <>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span><FaStar className="text-3xl text-amber-300 drop-shadow-md" /></span>
              المنتجات المميزة
            </h2>

            {/* Mobile Slider */}
            <div className="md:hidden overflow-x-auto snap-x snap-mandatory no-scrollbar">
              <div className="flex">
                {setupData?.featuredProducts.map(item => (
                  <div
                    key={item._id}
                    className="w-screen shrink-0 snap-center px-4 py-2"
                  >
                    <ProductCard
                      id={item._id}
                      title={item.name}
                      price={item.price}
                      image={item.images[0].url}
                      stock={item.stock}
                      code={item.productNumber}
                      comparePrice={item.comparePrice}
                      category={item?.categoryId?.name}
                      onAdd={() => openCart(item)}
                      star={true}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
                  star={true}
                />
              ))}
            </div>
          </>
        }

        {
          setupData?.newProducts &&
          <>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 mt-10">
              <span><FaBoxOpen className="text-4xl text-green-600 drop-shadow-md" /> </span>
              المنتجات المضافة حديثا
            </h2>
            {/* Mobile Slider */}
            <div className="md:hidden overflow-x-auto snap-x snap-mandatory no-scrollbar">
              <div className="flex">
                {setupData?.newProducts.map(item => (
                  <div
                    key={item._id}
                    className="w-screen shrink-0 snap-center px-4 py-2"
                  >
                    <ProductCard
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
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
          </>
        }
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
