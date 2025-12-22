import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Clock,
  DollarSign,
  Mail,
  Menu,
  Phone,
  Shield,
  Star,
  X,
} from 'lucide-react';

const SELL_PHONE = '(123) 456-7890';
const SELL_PHONE_TEL = '+1234567890';
const SELL_EMAIL = 'sell@striply.com';

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = 84;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

export default function SellerLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const navLinks = useMemo(
    () => [
      { label: 'Why us', id: 'benefits' },
      { label: 'How it works', id: 'how-it-works' },
      { label: 'Reviews', id: 'testimonials' },
      { label: 'FAQ', id: 'faq' },
    ],
    []
  );

  useEffect(() => {
    if (!showForm) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowForm(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [showForm]);

  const benefits = [
    { icon: DollarSign, title: 'Competitive offers', description: 'Transparent quotes based on brand and expiration.' },
    { icon: Clock, title: 'Fast turnaround', description: 'Quick review so you can get paid sooner.' },
    { icon: Shield, title: 'Secure process', description: 'Clear packaging and verification steps.' },
    { icon: BadgeCheck, title: 'Simple & friendly', description: 'No confusing steps — we guide you end‑to‑end.' },
  ];

  const steps = [
    { number: '1', title: 'Request a quote', description: 'Call, email, or send a quick form.' },
    { number: '2', title: 'Ship or drop off', description: 'We confirm items and eligibility.' },
    { number: '3', title: 'Get paid', description: 'Payment is sent after verification.' },
  ];

  const testimonials = [
    { name: 'Sarah M.', rating: 5, text: 'Fast, professional, and super easy. I got paid quickly.' },
    { name: 'John D.', rating: 5, text: 'Clear communication the whole time. Would recommend.' },
    { name: 'Maria L.', rating: 5, text: 'Smooth process and great service. Thank you!' },
  ];

  const faqs = [
    {
      q: 'What items do you buy?',
      a: 'Mostly diabetic supplies (depending on brand/expiration). Contact us for a quick quote.',
    },
    {
      q: 'How do I get a quote?',
      a: 'Call or email us, or tap “Get a quote” to send your details.',
    },
    {
      q: 'When do I get paid?',
      a: 'After items are received and verified. Turnaround depends on shipping/verification.',
    },
    {
      q: 'Do you accept expired or damaged boxes?',
      a: 'Some buyers do. We’ll confirm eligibility during quoting.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-24 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Striply" className="h-20 w-auto" />
              <div className="hidden sm:block text-xs text-gray-500">Sell diabetic supplies • Fast, secure, simple</div>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => scrollToId(l.id)}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  {l.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Business login
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setShowForm(true);
                }}
                className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Get a quote <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
                aria-label="Open menu"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900">Menu</div>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="p-2 rounded-md hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5 text-gray-700" />
                </button>
              </div>
              <div className="mt-4 space-y-2">
                {navLinks.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      scrollToId(l.id);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    {l.label}
                  </button>
                ))}
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Business login
                </Link>
              </div>
              <div className="mt-6 border-t pt-4 text-sm text-gray-600 space-y-2">
                <a href={`tel:${SELL_PHONE_TEL}`} className="flex items-center gap-2 hover:text-gray-900">
                  <Phone className="h-4 w-4" /> {SELL_PHONE}
                </a>
                <a href={`mailto:${SELL_EMAIL}`} className="flex items-center gap-2 hover:text-gray-900">
                  <Mail className="h-4 w-4" /> {SELL_EMAIL}
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-200 blur-3xl opacity-60" />
          <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-sky-200 blur-3xl opacity-60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                <Check className="h-4 w-4 text-emerald-600" />
                Trusted process • Clear steps • Fast quotes
              </div>
              <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                Sell diabetic supplies
                <span className="text-emerald-600"> quickly</span> and <span className="text-emerald-600">securely</span>.
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">
                Get a quote, ship or drop off, then get paid after verification. Simple and straightforward.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setShowForm(true);
                  }}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 font-semibold"
                >
                  Get a quote <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <a
                  href={`tel:${SELL_PHONE_TEL}`}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 font-semibold"
                >
                  <Phone className="mr-2 h-5 w-5 text-emerald-700" />
                  Call {SELL_PHONE}
                </a>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                <span className="inline-flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-700" /> Secure handling
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-700" /> Fast turnaround
                </span>
                <span className="inline-flex items-center gap-2">
                  <Star className="h-4 w-4 text-emerald-700" /> Great service
                </span>
              </div>
            </div>

            <div className="bg-white/80 border border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="text-sm font-semibold text-gray-900">Quick checklist</div>
              <p className="mt-1 text-sm text-gray-600">To get the best quote, have these ready:</p>
              <ul className="mt-4 space-y-3 text-sm text-gray-700">
                {['Brand & type', 'Quantity', 'Expiration dates', 'Condition (mint/dinged/damaged)'].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-600 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                <div className="text-xs font-semibold text-emerald-900">Business owners</div>
                <div className="mt-1 text-sm text-emerald-900">
                  Manage buyers, products, and pricing in the Striply dashboard.
                </div>
                <Link
                  to="/login"
                  className="mt-3 inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                >
                  Go to business login <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-14 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900">Why sell with us</h2>
            <p className="mt-2 text-gray-600">Simple, clear, and focused on a smooth experience.</p>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="mt-4 font-semibold text-gray-900">{b.title}</div>
                  <div className="mt-1 text-sm text-gray-600">{b.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-14 bg-gradient-to-br from-emerald-50 to-sky-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
            <p className="mt-2 text-gray-600">Three steps from quote to payment.</p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.number} className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-600 text-white font-bold">
                  {s.number}
                </div>
                <div className="mt-4 font-semibold text-gray-900">{s.title}</div>
                <div className="mt-1 text-sm text-gray-600">{s.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-14 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900">Sellers love the simplicity</h2>
            <p className="mt-2 text-gray-600">A quick snapshot of the experience.</p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <div className="mt-3 text-sm text-gray-700">“{t.text}”</div>
                <div className="mt-4 text-sm font-semibold text-gray-900">— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-14 bg-gray-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900">FAQ</h2>
            <p className="mt-2 text-gray-600">Common questions we get from sellers.</p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="font-semibold text-gray-900">{f.q}</div>
                <div className="mt-2 text-sm text-gray-600">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold">Ready to get a quote?</h2>
              <p className="mt-2 text-emerald-50">Call or email us, or use the quick form.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setShowForm(true);
                }}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-emerald-700 font-semibold hover:bg-emerald-50"
              >
                Get a quote <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <a
                href={`mailto:${SELL_EMAIL}`}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/60 text-white font-semibold hover:bg-white/10"
              >
                <Mail className="mr-2 h-5 w-5" />
                {SELL_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative mx-auto max-w-lg px-4 py-10">
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Get a quote"
              className="rounded-2xl bg-white shadow-xl border border-gray-200 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-gray-900">Get a quote</div>
                  <div className="text-sm text-gray-600">We’ll contact you with next steps.</div>
                </div>
                <button
                  type="button"
                  className="p-2 rounded-md hover:bg-gray-100"
                  aria-label="Close"
                  onClick={() => setShowForm(false)}
                >
                  <X className="h-5 w-5 text-gray-700" />
                </button>
              </div>

              <div className="px-6 py-5">
                {submitted ? (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                    <div className="font-semibold text-emerald-900">Thanks — we received your request.</div>
                    <div className="mt-1 text-sm text-emerald-900">
                      If you prefer, you can also call <a className="underline" href={`tel:${SELL_PHONE_TEL}`}>{SELL_PHONE}</a> or email{' '}
                      <a className="underline" href={`mailto:${SELL_EMAIL}`}>{SELL_EMAIL}</a>.
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                        onClick={() => setShowForm(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Message (optional)</label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Brand, quantity, and expiration dates are helpful."
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div className="pt-2 flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 text-gray-800 font-semibold hover:bg-gray-50"
                        onClick={() => setShowForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img src="/logo.png" alt="Striply" className="h-20 w-auto mb-4" />
              <p className="text-gray-400 text-sm">Sell diabetic supplies with a simple, secure process.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Quick links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {navLinks.map((l) => (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => scrollToId(l.id)}
                      className="hover:text-white transition-colors"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
                <li>
                  <Link to="/login" className="hover:text-white transition-colors">
                    Business login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${SELL_PHONE_TEL}`} className="hover:text-white transition-colors">
                    {SELL_PHONE}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${SELL_EMAIL}`} className="hover:text-white transition-colors">
                    {SELL_EMAIL}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Striply. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

