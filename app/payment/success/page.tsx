"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ShoppingBag, Loader2, AlertCircle } from "lucide-react";
import { useCart } from "../../../context/CartContext";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { clearCart } = useCart();

    const transactionId = searchParams.get("id");
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const [orderDetails, setOrderDetails] = useState<any>(null);

    useEffect(() => {
        if (!transactionId) {
            router.push("/");
            return;
        }

        const verifyPayment = async () => {
            try {
                const response = await fetch("/api/payment/phonepe/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ transactionId }),
                });

                const data = await response.json();

                if (data.success) {
                    setStatus("success");
                    setOrderDetails(data.orderDetails);
                    clearCart(); // Clear the cart on successful payment
                } else {
                    setStatus("failed");
                }
            } catch (error) {
                console.error("Verification error:", error);
                setStatus("failed");
            }
        };

        verifyPayment();
    }, [transactionId, router, clearCart]);

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <h2 className="text-2xl font-semibold text-white">Verifying Payment...</h2>
                <p className="text-gray-400">Please wait while we confirm your order.</p>
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Payment Failed</h2>
                    <p className="text-gray-400 max-w-md mx-auto">
                        We couldn't verify your payment. If the amount was deducted, it will be refunded automatically within 5-7 business days.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link
                        href="/checkout"
                        className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                    >
                        Try Again
                    </Link>
                    <Link
                        href="/contact"
                        className="bg-black border border-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto pt-10 pb-20 px-4">
            <div className="bg-[#121212] border border-gray-800 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>

                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 mx-auto mb-8">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Order Confirmed!</h1>
                <p className="text-gray-400 text-lg mb-8">
                    Thank you for your purchase. Your order has been placed successfully.
                </p>

                <div className="bg-black/50 rounded-2xl p-6 mb-8 text-left border border-gray-800">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-4">
                        <span className="text-gray-400">Order ID</span>
                        <span className="font-mono text-white select-all">{transactionId}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-4">
                        <span className="text-gray-400">Amount Paid</span>
                        <span className="font-bold text-white">₹ {orderDetails?.amount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Payment Method</span>
                        <span className="text-white capitalize">Online Payment (PhonePe)</span>
                    </div>
                </div>

                <Link
                    href="/shop"
                    className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-600/20 group w-full sm:w-auto"
                >
                    Continue Shopping
                    <ShoppingBag className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500/30">
            {/* Simple Header */}
            <header className="p-6 border-b border-gray-800 flex justify-center">
                <h1 className="text-2xl font-bold tracking-tight">Cube Tech</h1>
            </header>

            <main>
                <Suspense fallback={<div className="flex justify-center pt-20">Loading...</div>}>
                    <PaymentSuccessContent />
                </Suspense>
            </main>
        </div>
    );
}
