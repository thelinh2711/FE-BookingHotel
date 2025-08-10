import Banner from '../components/Banner';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Reviews from '../components/Reviews';
import PaginatedRoomsSection from '../components/PaginatedRoomsSection';
import data from '../data/mockData.json'; // ⬅ import JSON

function Home() {
  const rooms = data.rooms;
  const mockReviews = data.reviews;

  return (
    <>
      <Header />
      <Banner />
      <SearchBar />

      {/* Top Rated */}
      <PaginatedRoomsSection
        title="Top Rated"
        items={rooms}
        pageSize={6}
        sortFn={(a, b) => (b.rating ?? 0) - (a.rating ?? 0)}
      />

      {/* On Sale */}
      <PaginatedRoomsSection
        title="On Sale"
        items={rooms}
        pageSize={6}
        filterFn={(x) => (x.discountPercent ?? 0) > 0}
        sortFn={(a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0)}
      />

      <main className="p-6 space-y-8">
        <section>
          <Reviews reviews={mockReviews} />
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;
