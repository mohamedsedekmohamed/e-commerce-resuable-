import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomePageContent from "@/components/home/HomePageContent";

function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <HomePageContent />

      <Footer />
    </main>
  );
}

export default Home;
