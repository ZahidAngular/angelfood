import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderTracking } from "@/components/OrderTracking";

export const metadata: Metadata = {
  title: "Track your order — Angel Food",
  description: "Follow your Angel Food order from our freezer to your door.",
  alternates: { canonical: "/track" },
  // A page reached by a one-off link carrying an order token has no business
  // in an index, and nothing here is any use without the link.
  robots: { index: false, follow: false },
};

export default function TrackPage() {
  return (
    <main className="bg-cream pb-24 pt-28 sm:pb-32 sm:pt-32">
      <Suspense fallback={null}>
        <OrderTracking />
      </Suspense>
    </main>
  );
}
