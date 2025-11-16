'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out TypeCN',
    icon: Zap,
    features: [
      'Access to 1 free lesson',
      'Basic progress tracking',
      'Audio pronunciation',
      'Community support',
      'Mobile friendly',
    ],
    cta: 'Get Started',
    href: '/auth/sign-up',
    popular: false,
    gradient: 'from-gray-500 to-gray-600',
  },
  {
    name: 'Pro Monthly',
    price: '$10',
    period: 'per month',
    description: 'Best for consistent learners',
    icon: Sparkles,
    features: [
      'Access to all lessons',
      'Advanced progress tracking',
      'Audio pronunciation',
      'Priority support',
      'Offline access',
      'Streak tracking',
      'Detailed analytics',
    ],
    cta: 'Start Learning',
    href: '/auth/sign-up',
    popular: true,
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    name: 'Lifetime Pro',
    price: '$99',
    period: 'one-time',
    description: 'Best value for serious learners',
    icon: Crown,
    features: [
      'Lifetime access to all lessons',
      'All future courses included',
      'Advanced progress tracking',
      'Priority support',
      'Offline access',
      'Streak tracking',
      'Detailed analytics',
      'Certificate of completion',
      'Early access to new features',
    ],
    cta: 'Get Lifetime Access',
    href: '/auth/sign-up',
    popular: false,
    gradient: 'from-yellow-500 to-orange-600',
  },
];

export function PricingSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            Pricing
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the plan that works best for your learning journey. All plans include our core features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full"
              >
                <Card
                  className={`relative h-full flex flex-col border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                    plan.popular
                      ? 'border-blue-500 dark:border-blue-400 shadow-xl shadow-blue-500/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8 pt-8">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <CardDescription className="text-sm">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2 text-sm">
                        {plan.period}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow flex flex-col">
                    <ul className="space-y-3 mb-8 flex-grow">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={inView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.3, delay: index * 0.1 + featureIndex * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    <Link href={plan.href} className="block mt-auto">
                      <Button
                        className={`w-full ${
                          plan.popular
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-black'
                        }`}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            All plans include a 7-day money-back guarantee. No questions asked.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure payment</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>24/7 support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
