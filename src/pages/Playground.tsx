
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Playground = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-3xl font-bold mb-4">API Playground</h1>
          <p className="text-xl text-gray-600 mb-8">Coming soon! This will be the interactive playground for testing Scrapeyard API.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Playground;
