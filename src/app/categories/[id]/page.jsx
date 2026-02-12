'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getProductsByCat } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import CustomSelect from "@/Components/CustomSelect"
import Loader from "@/Components/Loader"
import ProductCard from "@/Components/ProductCard"
import CartSidePanel from "@/Components/CartSidePanel"

const PAGE_LIMIT = 20

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "priceAsc", label: "السعر: من الأقل" },
  { value: "priceDesc", label: "السعر: من الأعلى" }
]

export default function CategoryDetails() {
  /* 1️⃣ categoryId من الرابط */
  const { id: categoryId } = useParams()

  /* 2️⃣ الكاش المركزي */
  const {
    categoryCache,
    setCategoryCache
  } = useAuth()

  /* 3️⃣ state للواجهة */
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState("newest")
  const [loading, setLoading] = useState(false)

  const [open, setOpen] = useState(false)
  const [activeProduct, setActiveProduct] = useState(null)

  /* 4️⃣ مفاتيح الكاش */
  const cacheKey = `${page}-${sort}`
  const catCache = categoryCache?.[categoryId]
  const pageData = catCache?.pages?.[cacheKey]

  /* 5️⃣ بيانات العرض */
  const products = pageData?.products || []
  const pagination = pageData?.pagination || {}
  const categoryInfo = catCache?.info

  /* 6️⃣ جلب البيانات (لو غير موجودة بالكاش) */
  useEffect(() => {
    if (!categoryId) return
    if (pageData) return   // ✅ موجود بالكاش

    const fetchData = async () => {
      try {
        setLoading(true)

        const res = await getProductsByCat(categoryId, {
          page,
          limit: PAGE_LIMIT,
          sort
        })

        const data = res.data

        setCategoryCache(prev => ({
          ...prev,
          [categoryId]: {
            info: data?.category,
            pages: {
              ...prev[categoryId]?.pages,
              [cacheKey]: {
                products: data.products,
                pagination: data.pagination
              }
            }
          }
        }))

      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [categoryId, page, sort])

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen"><Loader size={30} color="#000" /></div>
    )
  }

  /* 7️⃣ الواجهة */
  return (
    <div className="container mx-auto px-6 py-12">

      {/* ===== Category Header ===== */}
      <div className="flex justify-start items-center mb-10 gap-4">

        {categoryInfo?.image?.url && (
          <img
            src={categoryInfo.image.url}
            alt={categoryInfo.name}
            className="w-24 h-24 rounded-xl shadow-sm object-cover border border-white"
          />
        )}
        <div>
          <h1 className="md:text-4xl text-xl font-black">
            {categoryInfo?.name || "—"}
          </h1>
          <p className={`${pagination.total > 0 ? 'text-green-600 bg-green-100':'text-red-600 bg-red-100' }  w-fit py-1 px-4 text-xs md:text-[16px] rounded-md mt-1 font-semibold`}>
            {pagination.total ?? 0} من المنتجات
          </p>
        </div>
      </div>

      {/* ===== Sort ===== */}
      <div className="flex justify-start mb-6">
        <CustomSelect
          value={sort}
          options={SORT_OPTIONS}
          placeholder="ترتيب حسب"
          onChange={(value) => {
            setSort(value)
            setPage(1) // مهم: نرجع لأول صفحة عند تغيير الترتيب
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {
          products.length > 0 ?
            products.map(p => (
              <ProductCard
                key={p._id}
                id={p._id}
                title={p.name}
                price={p.price}
                comparePrice={p.comparePrice}
                image={p.images?.[0]?.url}
                code={p.productNumber}
                stock={p.stock}
                category={categoryInfo?.name}
                onAdd={() => {
                  setActiveProduct(p)
                  setOpen(true)
                }}
              />
            ))
            :
            <div className="w-full h-[55vh] col-span-4 flex items-center justify-center font-bold text-2xl text-gray-400">لا يوجد منتجات</div>
        }
      </div>

      {/* ===== Pagination ===== */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: pagination.totalPages }).map((_, i) => {
            const p = i + 1
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-2 rounded-lg border font-semibold
                  ${p === page
                    ? "bg-black text-white border-black"
                    : "bg-white border-gray-300 hover:border-black"}
                `}
              >
                {p}
              </button>
            )
          })}
        </div>
      )}

      {/* ===== Cart Panel ===== */}
      {activeProduct && (
        <CartSidePanel
          open={open}
          onClose={() => {
            setOpen(false)
            setActiveProduct(null)
          }}
          selections={activeProduct.selections}
          id={activeProduct._id}
          name={activeProduct.name}
          stock={activeProduct.stock}
          price={activeProduct.price}
          comparePrice={activeProduct.comparePrice}
          image={activeProduct.images?.[0]?.url}
        />
      )}
    </div>
  )
}
