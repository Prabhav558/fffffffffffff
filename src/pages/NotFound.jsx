// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-primary-500">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Page not found</h2>
          <p className="mt-3 text-gray-600">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or doesn't exist.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            <Link
              to="/"
              className="btn btn-primary inline-flex items-center"
            >
              <FiHome className="mr-2" />
              Go back home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="text-primary-600 hover:text-primary-800 inline-flex items-center"
            >
              <FiArrowLeft className="mr-2" />
              Go back to previous page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;