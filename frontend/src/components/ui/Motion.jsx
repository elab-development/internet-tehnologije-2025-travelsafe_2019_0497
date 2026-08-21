import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

const easeOut = [0.16, 1, 0.3, 1]

export function PageTransition({ children, className = '' }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -8, filter: 'blur(6px)' }}
      transition={{ duration: 0.34, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const reduceMotion = useReducedMotion()
  const Component = motion[as] ?? motion.div

  return (
    <Component
      initial={reduceMotion ? false : { opacity: 1, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.48, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </Component>
  )
}

export function Stagger({ children, className = '', as = 'div' }) {
  const reduceMotion = useReducedMotion()
  const Component = motion[as] ?? motion.div

  return (
    <Component
      initial={reduceMotion ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
      }}
      className={className}
    >
      {children}
    </Component>
  )
}

export function StaggerItem({ children, className = '', as = 'div' }) {
  const Component = motion[as] ?? motion.div

  return (
    <Component
      variants={{
        hidden: { opacity: 1, y: 14 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.42, ease: easeOut },
        },
      }}
      className={className}
    >
      {children}
    </Component>
  )
}

export function AnimatedWords({ text, className = '', wordClassName = '' }) {
  const reduceMotion = useReducedMotion()

  return (
    <span className={className}>
      {text.split(' ').map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={reduceMotion ? false : { opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.42, delay: reduceMotion ? 0 : index * 0.055, ease: easeOut }}
          className={`mr-[0.18em] inline-block ${wordClassName}`}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

export function TiltCard({ children, className = '', intensity = 8 }) {
  const reduceMotion = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 180, damping: 22 })
  const springY = useSpring(pointerY, { stiffness: 180, damping: 22 })
  const rotateX = useTransform(springY, [-0.5, 0.5], [intensity, -intensity])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-intensity, intensity])

  const handleMove = (event) => {
    if (reduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const handleLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function DrawnRoute({ className = '' }) {
  const reduceMotion = useReducedMotion()

  return (
    <svg className={className} viewBox="0 0 640 360" fill="none" aria-hidden="true">
      <motion.path
        d="M42 280 C128 160 214 245 292 132 C368 24 468 84 598 42"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="2"
        strokeDasharray="8 10"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0.2 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.3, ease: easeOut }}
      />
      <motion.path
        d="M42 280 C128 160 214 245 292 132 C368 24 468 84 598 42"
        stroke="url(#routeGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.22, ease: easeOut }}
      />
      {[42, 292, 598].map((cx, index) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy={[280, 132, 42][index]}
          r="7"
          fill={index === 1 ? '#14b8a6' : '#f9735b'}
          initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.65 + index * 0.18, duration: 0.34, ease: easeOut }}
        />
      ))}
      <defs>
        <linearGradient id="routeGradient" x1="42" y1="280" x2="598" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="0.45" stopColor="#14b8a6" />
          <stop offset="1" stopColor="#f9735b" />
        </linearGradient>
      </defs>
    </svg>
  )
}
