import Banner from '../components/Banner';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';

function Home() {
  return (
    <>
      <Header />
      <Banner />
      <SearchBar />
      <main className="p-6">
        <h1 className="text-2xl font-bold">Welcome to Home</h1>
      </main>
      <Footer />
    </>
  );
}

export default Home;
