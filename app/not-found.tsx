import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NotFoundContent from "@/components/NotFoundContent";

export const metadata: Metadata = { title: "Page not found" };

// Addresses that match no route at all render here, outside the (site) layout, so the header and footer are added.
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}
