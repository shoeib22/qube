"use client";

import React from "react";
import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function PaymentFailurePage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-red-500/30 flex flex-col">
            {/* Simple Header */}
            <header className="p-6 border-b border-gray-800 flex justify-center">
                <h1 className="text-2xl font-bold tracking-tight">Cube Tech</h1>
            </header>

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mx-auto mb-8 animate-pulse">
                        <XCircle className="w-12 h-12 text-red-500" />
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-4">Payment Failed</h1>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        We couldn't process your payment. This could be due to a declined transaction, network issue, or cancellation. No money has been deducted.
                    </p>

                    <div className="space-y-4">
                        <Link
                            href="/checkout"
                            className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center group"
                        >
                            <RefreshCw className="mr-2 w-5 h-5 group-hover:rotate-180 transition-transform" />
                            Retry Payment
                        </Link>

                        <Link
                            href="/cart"
                            className="w-full bg-transparent border border-gray-800 text-gray-400 py-4 rounded-xl font-bold hover:text-white hover:border-gray-600 transition-all flex items-center justify-center"
                        >
                            <ArrowLeft className="mr-2 w-5 h-5" />
                            Return to Cart
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
