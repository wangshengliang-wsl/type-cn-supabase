import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out TypeCN',
    features: [
      'Access to 2 free lessons',
      'Basic progress tracking',
      'Audio pronunciation',
      'Community support',
    ],
    current: true,
  },
  {
    name: 'Monthly',
    price: '$10',
    period: 'per month',
    description: 'Best for consistent learners',
    features: [
      'Access to all lessons',
      'Advanced progress tracking',
      'Audio pronunciation',
      'Priority support',
      'Offline access',
      'Streak tracking',
    ],
    popular: true,
  },
  {
    name: 'Lifetime',
    price: '$99',
    period: 'one-time',
    description: 'Best value for serious learners',
    features: [
      'Lifetime access to all lessons',
      'All future courses included',
      'Advanced progress tracking',
      'Priority support',
      'Offline access',
      'Streak tracking',
      'Certificate of completion',
    ],
  },
];

export default function MembershipPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Upgrade Your Learning
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose the plan that works best for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`relative ${
              plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                  {plan.price}
                </span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">
                  {plan.period}
                </span>
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-400">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.current
                    ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-900 text-white dark:bg-gray-700 dark:hover:bg-gray-600'
                }`}
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : 'Upgrade Now'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Can I cancel my subscription anytime?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Yes, you can cancel your monthly subscription at any time. You'll continue to have access until the end of your billing period.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We accept all major credit cards and PayPal.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Is the Lifetime plan really lifetime?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Yes! Pay once and get access to all current and future courses forever.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

