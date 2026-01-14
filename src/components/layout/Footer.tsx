import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-card-bg)] border-t border-[var(--color-border)] mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[var(--color-gold)]">BA12 Automotive</h3>
            <p className="text-[var(--color-gold)] opacity-80">
              Quality used cars in excellent condition. Your trusted partner for finding the perfect vehicle.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[var(--color-gold)]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[var(--color-gold)] hover:text-[var(--color-gold-hover)] opacity-80 hover:opacity-100 transition-opacity">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/showroom" className="text-[var(--color-gold)] hover:text-[var(--color-gold-hover)] opacity-80 hover:opacity-100 transition-opacity">
                  Showroom
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[var(--color-gold)] hover:text-[var(--color-gold-hover)] opacity-80 hover:opacity-100 transition-opacity">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[var(--color-gold)] hover:text-[var(--color-gold-hover)] opacity-80 hover:opacity-100 transition-opacity">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[var(--color-gold)]">Contact Us</h3>
            <ul className="space-y-2 text-[var(--color-gold)] opacity-80">
              <li>Email: sales@ba12automotive.co.uk</li>
              <li>Follow us on social media</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-[var(--color-border)] text-center">
          <p className="text-[var(--color-gold)] opacity-60">
            &copy; {currentYear} BA12 Automotive. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
