import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-[var(--color-gold)]">
            About BA12 Automotive
          </h1>

          <div className="card mb-8 text-left">
            <h2 className="text-2xl font-bold mb-6 text-center text-[var(--color-gold)]">
              Welcome to BA12 Automotive
            </h2>

            <div className="space-y-6 text-[var(--color-gold)] opacity-90 leading-relaxed text-lg">
              <p>
                With over 8 years of experience in the motor trade, BA12 Automotive is a trusted, independent used car specialist based in Warminster, Wiltshire – just a short drive from Longleat Safari Park.
              </p>

              <p>
                We take pride in offering a friendly, professional service with a focus on quality, value, and customer satisfaction. Every vehicle we sell is carefully selected, fully inspected, and competitively priced to ensure you receive outstanding value and complete peace of mind.
              </p>

              <ul className="space-y-3 my-6 list-none">
                <li className="flex items-start">
                  <span className="text-[var(--color-gold)] mr-3">✓</span>
                  <span>All retail vehicles come with a warranty</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--color-gold)] mr-3">✓</span>
                  <span>AA and RAC inspections are welcome</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--color-gold)] mr-3">✓</span>
                  <span>Part exchanges considered</span>
                </li>
              </ul>

              <p>
                We invite you to browse our latest stock online or visit us in person – we're open 7 days a week and ready to help you find your next car.
              </p>

              <p className="font-bold text-center pt-4">
                BA12 Automotive – A relaxed approach to buying your next vehicle.
              </p>
            </div>
          </div>

          {/* CTA Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card text-center">
              <h3 className="text-xl font-bold mb-4 text-[var(--color-gold)]">
                Browse Our Stock
              </h3>
              <p className="text-[var(--color-gold)] opacity-80 mb-6">
                View our current selection of quality used vehicles
              </p>
              <Link href="/showroom">
                <Button variant="primary" className="w-full">
                  View Showroom
                </Button>
              </Link>
            </div>

            <div className="card text-center">
              <h3 className="text-xl font-bold mb-4 text-[var(--color-gold)]">
                Get In Touch
              </h3>
              <p className="text-[var(--color-gold)] opacity-80 mb-6">
                Have questions? We're here to help
              </p>
              <Link href="/contact">
                <Button variant="primary" className="w-full">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
