'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    icon: '⌨️',
    title: 'Interactive Typing Practice',
    description: 'Learn Chinese characters through hands-on typing exercises with real-time feedback and pronunciation guides.',
  },
  {
    icon: '📊',
    title: 'Leveled Courses',
    description: 'Progress from beginner to advanced with carefully structured lessons that match your skill level.',
  },
  {
    icon: '🎮',
    title: 'Gamified Learning',
    description: 'Stay motivated with achievements, streaks, and progress tracking that makes learning fun.',
  },
  {
    icon: '🔊',
    title: 'Audio Pronunciation',
    description: 'Listen to native pronunciation for every word and phrase to improve your listening skills.',
  },
  {
    icon: '✅',
    title: 'Instant Feedback',
    description: 'Get immediate corrections and learn the right way to type Chinese pinyin with helpful hints.',
  },
  {
    icon: '📱',
    title: 'Learn Anywhere',
    description: 'Access your lessons on any device and continue learning wherever you are.',
  },
];

export function FeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="features" className="py-24 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Why Choose TypeCN?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to master Chinese typing in one place
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-white dark:bg-gray-950 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover-lift"
            >
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

