import { motion } from "framer-motion";
import {
  Upload,
  BarChart,
  Scan,
  Shield,
  PieChart,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="text-center py-24">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
        >
          Smarter Way to Track Your Expenses
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-6 text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300"
        >
          Upload receipts, auto-categorize your expenses, and get insights with
          AI-powered analytics.
        </motion.p>
        <motion.a
          href="/register"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:opacity-90 transition"
        >
          Get Started
        </motion.a>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Upload Receipt",
              desc: "Simply upload your expense receipt.",
              icon: <Upload className="w-10 h-10 mx-auto text-blue-500 mb-4" />,
            },
            {
              title: "AI Categorization",
              desc: "AI categorizes your expenses instantly.",
              icon: <Scan className="w-10 h-10 mx-auto text-purple-500 mb-4" />,
            },
            {
              title: "Get Insights",
              desc: "View smart analytics and charts.",
              icon: (
                <BarChart className="w-10 h-10 mx-auto text-green-500 mb-4" />
              ),
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg text-center"
            >
              {item.icon}
              <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-500 dark:text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Secure & Private",
              desc: "Your financial data stays encrypted and safe.",
              icon: (
                <Shield className="w-10 h-10 mx-auto text-indigo-500 mb-4" />
              ),
            },
            {
              title: "Smart Analytics",
              desc: "Visualize where your money goes with charts & insights.",
              icon: (
                <PieChart className="w-10 h-10 mx-auto text-pink-500 mb-4" />
              ),
            },
            {
              title: "AI Powered",
              desc: "Our AI learns your spending habits for better tracking.",
              icon: (
                <Sparkles className="w-10 h-10 mx-auto text-yellow-500 mb-4" />
              ),
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg text-center"
            >
              {item.icon}
              <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-500 dark:text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold mb-6"
        >
          Ready to Take Control of Your Expenses?
        </motion.h2>
        <motion.a
          href="/register"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold shadow-lg hover:opacity-90 transition"
        >
          Get Started Now
        </motion.a>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-600 dark:text-gray-400 border-t dark:border-gray-700">
        <p>© {new Date().getFullYear()} SmartExpense. All rights reserved.</p>
      </footer>
    </>
  );
}
