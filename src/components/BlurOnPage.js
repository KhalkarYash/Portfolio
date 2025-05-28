import { motion } from "motion/react";

export default function BlurOnLoad({children}) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(20px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{duration: 1, ease: "easeOut"}}
      className="w-full h-64 bg-cover bg-center"
    >
      {children}
    </motion.div>
  );
}
