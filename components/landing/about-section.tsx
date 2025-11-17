'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="about" className="py-24 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Learn Chinese Typing the Right Way
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              TypeCN is designed specifically for English speakers learning Chinese. Our platform combines proven language learning techniques with modern technology to make mastering Chinese typing easy and enjoyable.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Whether you&apos;re preparing for HSK exams, planning to study in China, or simply passionate about Chinese culture, our structured courses will help you achieve your goals.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">10+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Course Levels</div>
              </div>
              <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">1000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Words & Phrases</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-400 to-purple-600 p-1">
              <div className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Your Learning Journey
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start with basic greetings and progress to complex conversations
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

