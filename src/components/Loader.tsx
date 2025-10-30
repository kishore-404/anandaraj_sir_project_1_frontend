// src/components/Loader.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Loader = () => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 z-[9999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* 🔹 Purple Circular Spinner */}
        <motion.div
          className="w-20 h-20 border-[6px] border-purple-300 border-t-purple-700 rounded-full animate-spin"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default Loader;
