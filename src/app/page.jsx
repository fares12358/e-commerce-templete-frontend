"use client"
import AdsSlider from "@/Components/AdsSlider";
import CategorySlider from "@/Components/CategorySlider";
import Loader from "@/Components/Loader";
import ProductCard from "@/Components/ProductCard";
import CartSidePanel from "@/Components/CartSidePanel";
import { useAuth } from "@/context/AuthContext";
import { useRef, useState } from "react";
import { FaBoxOpen, FaStar } from "react-icons/fa";

export default function Home() {
  const { setupData, setupLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderRefProd = useRef(null);
  const [currentIndexProd, setCurrentIndexProd] = useState(0);

  const handleScroll = () => {
    if (!sliderRef.current || !setupData?.featuredProducts) return;

    const el = sliderRef.current;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const progress = el.scrollLeft / maxScroll;

    const index = Math.round(progress * (setupData.featuredProducts.length - 1)) * -1;

    setCurrentIndex(index);
  };

  const handleScrollProd = () => {
    if (!sliderRefProd.current || !setupData?.newProducts) return;

    const el = sliderRefProd.current;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const progress = el.scrollLeft / maxScroll;

    const index = Math.round(progress * (setupData.newProducts.length - 1)) * -1;

    setCurrentIndexProd(index);
  };

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
      <section className="container mx-auto px-4 py-1 pt-6">
        {setupData?.ads &&
          <AdsSlider />
        }
        {
          setupData?.categories &&
          <CategorySlider />
        }
        {
          setupData?.featuredProducts &&
          <>
            <h2 className="text-2xl md:text-5xl font-bold flex items-center gap-2 my-10 md:my-20">
              <span className="bg-linear-to-br from-amber-500 to-amber-300 p-4 rounded-2xl rotate-12 shadow-sm ml-2"><FaStar className="text-3xl text-white drop-shadow-md -rotate-12" /></span>
              المنتجات المميزة
            </h2>

            {/* Mobile Slider */}
            <div className="md:hidden overflow-x-auto snap-x snap-mandatory no-scrollbar"
              ref={sliderRef}
              onScroll={handleScroll}
            >
              <div className="flex w-fit h-fit gap-1">
                {setupData?.featuredProducts.map((item, i) => (
                  <div
                    key={item._id}
                    className="w-screen shrink-0 snap-center snap-always py-2 px-4"
                  >
                    <ProductCard
                      id={item._id}
                      title={item.name}
                      price={item.price}
                      image={item.images[0].url}
                      stock={item.stock}
                      code={item.productNumber}
                      comparePrice={item.comparePrice}
                      category={item?.category?.name}
                      onAdd={() => openCart(item)}
                      star={true}
                    />
                  </div>
                ))}

              </div>
            </div>
            <div className="flex md:hidden w-full items-center justify-center gap-2 mt-5 font-bold">

              <div className="bg-linear-to-br from-black to-black/60 text-white px-3 py-1 rounded-md">
                {setupData?.featuredProducts.length}
              </div>

              <span className="text-xl">/</span>

              <div className="bg-linear-to-br from-gray-300 to-gray-100 px-3 py-1 rounded-md">
                {currentIndex + 1}
              </div>

            </div>

            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
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
                  category={item?.category?.name}
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
            <h2 className="text-2xl md:text-5xl font-bold flex items-center gap-2 my-10 md:my-20">
              <span className="bg-linear-to-br from-green-700 to-green-400 p-4 rounded-2xl rotate-12 shadow-sm ml-2"><FaBoxOpen className="text-3xl text-white drop-shadow-md -rotate-12" /> </span>
              المنتجات المضافة حديثا
            </h2>
            {/* Mobile Slider */}
            <div className="md:hidden overflow-x-auto snap-x snap-mandatory no-scrollbar"
              ref={sliderRefProd}
              onScroll={handleScrollProd}
            >
              <div className="flex h-fit w-fit gap-1">
                {setupData?.newProducts.map(item => (
                  <div
                    key={item._id}
                    className="w-screen shrink-0 snap-center snap-always px-4 py-2"
                  >
                    <ProductCard
                      id={item._id}
                      title={item.name}
                      price={item.price}
                      image={item.images[0].url}
                      stock={item.stock}
                      code={item.productNumber}
                      comparePrice={item.comparePrice}
                      category={item?.category?.name}
                      onAdd={() => openCart(item)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex md:hidden w-full items-center justify-center gap-2 mt-5 mb-10 font-bold">

              <div className="bg-linear-to-br from-black to-black/60 text-white px-3 py-1 rounded-md">
                {setupData?.newProducts.length}
              </div>

              <span className="text-xl">/</span>

              <div className="bg-linear-to-br from-gray-300 to-gray-100 px-3 py-1 rounded-md">
                {currentIndexProd + 1}
              </div>

            </div>

            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-10">
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
                  category={item?.category?.name}
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
