import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full min-w-0 min-h-screen flex-col">
      <Header />

      <main className="w-full min-w-0 flex-1">{children}</main>

      <Footer />
    </div>
  );
}
