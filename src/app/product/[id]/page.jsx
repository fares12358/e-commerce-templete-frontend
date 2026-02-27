'use client'
import { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { addToCart, getProductByID } from "@/lib/api"
import { motion } from "framer-motion"
import { FaShoppingCart, FaCheckCircle, FaTimesCircle } from "react-icons/fa"
import { useAuth } from "@/context/AuthContext"
import Loader from "@/Components/Loader"
import { toast } from "react-toastify"

function MainImage({ src }) {
  return (
    <motion.div
      key={src}
      initial={{ opacity: 0.4, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-100 border border-gray-200 rounded-xl overflow-hidden shadow-md md:order-2 -order-1
                 w-full h-105 sm:h-130 lg:h-155 p-5"
    >
      <img
        src={src}
        className="w-full h-full object-contain rounded-md"
        alt="product"
      />
    </motion.div>
  )
}

export default function ProductDetails() {
  const { setupData, products, simple, user } = useAuth()
  const params = useParams()
  const id = params?.id

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const [product, setProduct] = useState(null)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [activeImage, setActiveImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const normalizeProduct = (data) => ({
    ...data,
    images: data.images?.map(img =>
      typeof img === "string" ? img : img.url
    ) || [],
    selections: data.selections?.map(sel => ({
      name: sel.name,
      options: sel.options.map(opt =>
        typeof opt === "string" ? opt : opt.value
      )
    })) || [],
    attributes: data.attributes || []
  })

  const handleAddToCart = useCallback(async () => {
    if (!user) {
      toast.error('تسجيل الدخول مطلوب')
      return
    }
    // 1️⃣ تحقق من المخزون
    if (quantity > product.stock) {
      toast.error("الكمية المطلوبة غير متاحة");
      return;
    }

    // 2️⃣ تحقق من اختيار كل selections
    if (product.selections?.length) {
      for (const sel of product.selections) {
        if (!selectedOptions[sel.name]) {
          toast.error(`يرجى اختيار ${sel.name}`);
          return;
        }
      }
    }

    // 3️⃣ تجهيز selections payload
    const selectionsPayload = Object.entries(selectedOptions).map(
      ([name, value]) => ({ name, value })
    );

    try {
      setAdding(true);

      await addToCart({
        productId: product._id,
        quantity,
        selections: selectionsPayload
      });

      toast.success("تمت إضافة المنتج إلى السلة 🛒");
      setQuantity(1);
      setSelectedOptions({})

    } catch (err) {
      toast.error("حدث خطأ أثناء الإضافة");
    } finally {
      setAdding(false);
    }
  }, [user, quantity, product, selectedOptions])


  const loadProduct = async () => {
    try {
      setLoading(true);
      const apiProduct = await getProductByID(id)
      if (apiProduct.success) {
        const normalized = normalizeProduct(apiProduct.data)
        setProduct(normalized)
        setActiveImage(normalized.images[0])
      }
    } catch (error) {
      toast.error(error.message || 'فشل تحميل المنتج')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return
    loadProduct()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen"><Loader size={30} color="#000" /></div>
    )
  }

  if (!product) return (
    <div className="w-full h-screen flex items-center justify-center text-xl font-semibold text-gray-400">المنتج غير متاح</div>
  )

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 lg:py-14 
                grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

      {/* Images */}
      <div className="lg:col-span-7 w-full max-w-full">

        {/* Main Image */}
        <div className="w-full aspect-square bg-gray-100 rounded-xl border border-gray-200 shadow-sm p-5 overflow-hidden">
          <img
            src={activeImage}
            className="w-full h-full object-contain rounded-xl"
            alt="product"
          />
        </div>

        {/* Thumbnails */}
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {product.images.map((img) => (
            <button
              key={img}
              onClick={() => setActiveImage(img)}
              className={`
        shrink-0 w-16 h-16 sm:w-20 sm:h-20
        rounded-lg border-2 overflow-hidden bg-white cursor-pointer shadow-sm
        ${activeImage === img ? "border-black/50" : "border-gray-200"}
      `}
            >
              <img
                src={img}
                className="w-full h-full object-contain"
                alt="thumb"
              />
            </button>
          ))}
        </div>

      </div>

      {/* Details */}
      <div className="lg:col-span-5 space-y-8">

        <div>
          <h1 className="text-xl md:text-4xl font-black leading-tight mb-5">
            {product.name}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {product.productNumber}
          </p>
          <p className="text-gray-400 text-xl md:text-2xl font-semibold mt-5">
            {product?.categoryId?.name}
          </p>
        </div>

        <div className="flex items-end gap-4">
          {
            product?.comparePrice > product?.price &&
            <span className="text-gray-300 line-through text-xl">
              {product?.comparePrice?.toLocaleString()}
            </span>
          }
          <span className="text-4xl font-bold">
            {product?.price?.toLocaleString()} {simple}
          </span>
        </div>

        {product.stock > 0 ? (
          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-md shadow-sm w-fit">
            <FaCheckCircle className="text-green-600" />
            <span className="text-green-700 text-xs font-bold">
              متوفر في المخزون {product.stock}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-md shadow-sm w-fit">
            <FaTimesCircle className="text-red-600" />
            <span className="text-red-700 text-xs font-bold">
              غير متوفر في المخزون {product.stock}
            </span>
          </div>
        )}

        {/* Selections */}
        <div className="space-y-6">

          {product.selections.map(selection => (
            <div key={selection.name} className="space-y-3">

              <p className="font-semibold text-sm">
                {selection.name}
              </p>

              <div className="flex flex-wrap gap-2">
                {selection.options.map(option => {
                  const active = selectedOptions[selection.name] === option

                  return (
                    <button
                      key={option}
                      onClick={() =>
                        setSelectedOptions(prev => ({
                          ...prev,
                          [selection.name]: option
                        }))
                      }
                      className={`
                      px-4 py-2 rounded-lg border text-sm font-semibold transition cursor-pointer
                      ${active
                          ? "bg-linear-to-br from-black to-black/70 border-gray-200 text-white"
                          : "bg-gray-100 border-gray-200 hover:bg-gray-200 cursor-pointer"
                        }
                    `}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>

            </div>
          ))}

        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="px-4 py-2 text-xl font-bold hover:bg-gray-200 cursor-pointer"
            >
              −
            </button>

            <span className="px-6 font-bold">
              {quantity}
            </span>

            <button
              onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
              className="px-4 py-2 text-xl font-bold hover:bg-gray-200 cursor-pointer"
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </div>
        </div>


        <motion.button
          onClick={handleAddToCart}
          disabled={adding || product.stock === 0}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-lg cursor-pointer bg-linear-to-br from-black to-black/70 text-white font-black text-lg 
             flex items-center justify-center gap-3 shadow-md hover:-translate-y-1 ease-in-out duration-300"
        >
          {adding ? (
            <Loader size={22} color="#fff" />
          ) : (
            <>
              أضف إلى العربة
              <FaShoppingCart />
            </>
          )}
        </motion.button>


        {/* Description */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold mb-2">الوصف</h3>
          <p className="text-gray-600 whitespace-pre-line leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Attributes — FLEX CLEAN */}
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200 shadow-sm">

          {product.attributes.map(attr => (
            <div
              key={attr.key}
              className="flex items-center justify-between px-6 py-4"
            >
              <span className="text-gray-500 text-sm">
                {attr.key}
              </span>
              <span className="font-bold text-sm">
                {attr.value}
              </span>
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}
