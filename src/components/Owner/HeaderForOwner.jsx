import { useParams, useNavigate, Link } from "react-router-dom";

const Header = () => (
  <header className="bg-white shadow">
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <nav className="hidden md:flex space-x-6">
        <Link
          to="/owner/dash"
          className="text-gray-600 hover:text-indigo-600 transition">
          Dashboard
        </Link>
      </nav>
    </div>
  </header>
);

export default Header;
