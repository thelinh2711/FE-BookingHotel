import Footer from '../components/Footer';
import Header from '../components/Header';

function About() {
  return (
    <>
      <Header />
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">About Us</h1>
        <p className="text-gray-700 leading-relaxed">
          Welcome to <strong>LankaStay</strong> – your trusted platform to find the perfect vacation rental.
          Our mission is to make your travel planning easier and your stays unforgettable.
        </p>
      </main>
      <Footer />
    </>
  );
}

export default About;
