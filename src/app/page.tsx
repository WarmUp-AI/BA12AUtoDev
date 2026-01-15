import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FeaturedCars } from '@/components/car/FeaturedCars';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16 px-2">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[var(--color-gold)] leading-tight py-4">
            Welcome to BA12 Automotive
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-[var(--color-gold)] opacity-80 px-2">
            Premium pre-owned vehicles, expertly maintained
          </p>
          <Link href="/showroom">
            <Button variant="primary" className="text-lg px-8 py-3">
              Browse Our Showroom
            </Button>
          </Link>
        </section>

        {/* Featured Cars */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-[var(--color-gold)]">
            Featured Vehicles
          </h2>
          <FeaturedCars />
          <div className="text-center mt-8">
            <Link href="/showroom">
              <Button>View All Vehicles</Button>
            </Link>
          </div>
        </section>

        {/* About Section */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6 text-[var(--color-gold)]">
            Your Trusted Car Dealer
          </h2>
          <p className="text-lg text-[var(--color-gold)] opacity-80 leading-relaxed">
            At BA12 Automotive, we pride ourselves on offering premium quality used cars.
            Each vehicle is carefully selected and inspected to ensure you get the best value
            for your money. Browse our collection and find your perfect car today.
          </p>
        </section>

        {/* Instagram Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-[var(--color-gold)]">
            Follow Us on Instagram
          </h2>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <iframe
                src="https://www.instagram.com/ba12_automotive/embed"
                className="w-full h-[500px] border border-[var(--color-border)] rounded-lg bg-[var(--color-card-bg)]"
                style={{ border: 0 }}
              />
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center card max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-[var(--color-gold)]">
            Have Questions?
          </h2>
          <p className="text-[var(--color-gold)] opacity-80 mb-6">
            Get in touch with us today. We're here to help you find the perfect vehicle.
          </p>
          <Link href="/contact">
            <Button variant="primary">Contact Us</Button>
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
