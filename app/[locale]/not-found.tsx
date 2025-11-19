import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-block bg-primary text-black px-6 py-3 rounded-lg font-semibold hover:bg-primary-light transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}





