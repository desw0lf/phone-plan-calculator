import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container relative">
          content
        </div>
      </main>
      <Footer />
    </div>
  );
}