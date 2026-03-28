import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

const NotFound = () => {
  document.title = '404 | Meena Bazar Dukaandaar Association';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm uppercase tracking-[0.25em] text-gold">Error 404</p>
      <h1 className="mt-4 font-heading text-6xl text-text">Page Not Found</h1>
      <p className="mt-3 text-text-muted">The page you are looking for is not available or has been moved.</p>
      <div className="mt-8"><Link to="/"><Button>Return Home</Button></Link></div>
    </motion.div>
  );
};

export default NotFound;
