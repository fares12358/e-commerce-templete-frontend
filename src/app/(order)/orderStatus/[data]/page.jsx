'use client'
import OrderFailed from '@/Components/order/OrderFailed'
import OrderSuccess from '@/Components/order/OrderSuccess'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
    const router = useRouter()
    return (
        <div>
            <OrderSuccess
                orderId="#INV-94021"
                deliveryDate="الخميس، 24 أكتوبر"
                paymentMethod="الدفع عند الاستلام"
                onTrack={() => router.push("/orders/94021")}
                onHome={() => router.push("/")}
            />
            <OrderFailed
                title="الدفع مرفوض"
                message="بطاقتك لم يتم قبولها. يرجى المحاولة بوسيلة أخرى."
                onRetry={() => router.push("/checkout")}
                onSupport={() => router.push("/contact")}
            />

        </div>
    )
}

export default page