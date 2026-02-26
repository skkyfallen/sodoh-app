import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#f5f8f5]">
      <Header />
      <main className="flex flex-col flex-1">{children}</main>
      <Footer />
    </div>
  );
}
