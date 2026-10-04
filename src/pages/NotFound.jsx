import { Link } from "react-router-dom";
import SEO from "../components/SEO";
function NotFound() {
  return (
    <div className="container page-space text-center">
        <SEO
  title="Page Not Found"
  description="The page you requested could not be found."
  noIndex={true}
/>
      <h1 className="display-1 fw-bold">404</h1>
      <h2>Page not found</h2>
      <p>The page you are looking for does not exist.</p>

      <Link to="/" className="primary-btn d-inline-block text-decoration-none">
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;