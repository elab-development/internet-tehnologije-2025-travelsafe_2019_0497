import { motion, useReducedMotion } from 'framer-motion'

export default function Card({ children, className = '', hover = false, ...props }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={`rounded-2xl bg-white p-5 shadow-card ${hover ? 'transition-shadow duration-200 hover:shadow-card-hover' : ''} ${className}`}
      whileHover={hover && !reduceMotion ? { y: -4 } : undefined}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
