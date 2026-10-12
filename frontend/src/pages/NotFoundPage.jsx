import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Compass, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="container py-5 text-center min-vh-75 d-flex flex-column align-items-center justify-content-center">
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-circle bg-violet-subtle text-violet mb-4"
        style={{ width: 80, height: 80 }}
      >
        <Compass size={40} />
      </div>
      <h1 className="display-4 fw-bold text-navy mb-2">404</h1>
      <h3 className="fw-bold text-navy mb-3">Page Not Found</h3>
      <p className="text-muted small mx-auto mb-4" style={{ maxWidth: '440px' }}>
        The page or project details you're looking for might have been moved, renamed, or is currently unavailable.
      </p>
      <Link to="/">
        <Button variant="primary" icon={Home}>
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
