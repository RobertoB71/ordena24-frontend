import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom";

export default function MainLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: -6 }
        }
        transition={{
          duration: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="min-h-screen"
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}
