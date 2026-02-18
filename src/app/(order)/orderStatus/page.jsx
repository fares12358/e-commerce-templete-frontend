'use client'

import OrderFailed from '@/Components/order/OrderFailed'
import OrderSuccess from '@/Components/order/OrderSuccess'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const Page = () => {

    const router = useRouter()
    const search = useSearchParams()

    const orderId = search.get("oid")
    const orderNumber = search.get("num")

    // حماية لو فتح الصفحة مباشرة بدون طلب
    useEffect(() => {
        if (!orderId || !orderNumber) {
            router.replace("/")
        }
    }, [orderId, orderNumber])

    if (!orderId) return null

    return (
        <OrderSuccess
            orderId={`${orderNumber}`}
            onTrack={() => router.push(`/orderDetails/${orderId}`)}
            onHome={() => router.push("/")}
        />
    )
}

export default Page
