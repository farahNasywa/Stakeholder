import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./FAQPage.css";
import Navbar from "../components/Navbar";

const faqs = [
  {
    question: "What is Stakeholder Name?",
    answer:
      "• Stakeholder Name is the name of an individual or group who can influence or be influenced by the organization’s activities, products, services, or performance.",
  },
  {
    question: "What is Role / Position / Institution?",
    answer:
      "• Role / Position / Institution refers to the official position, job title, or organization/institution where the stakeholder is affiliated.",
  },
  {
    question: "What is Stakeholder Type?",
    answer:
      "• Stakeholder Type is the stakeholder's category based on their role, for example:\n  - government\n  - community\n  - NGO\n  - company\n  - indigenous group",
  },
  {
    question: "What is Engagement Category?",
    answer:
      "• Engagement Category classifies stakeholders based on their level of influence, impact, interest, and engagement urgency.\n" +
      "1. Primary\n" +
      "   - Stakeholders who are directly impacted or have high influence, power, or control over project success.\n" +
      "   - There is usually mutual dependency or high risk if their interests are not met.\n" +
      "   - Engagement should be ongoing, proactive, and strategic.\n" +
      "2. Secondary\n" +
      "   - Stakeholders with moderate influence or impact; may serve as supporter, regulator, advisor, or monitor.\n" +
      "   - No direct decision-making power.\n" +
      "   - Engagement is periodic or issue-based.\n" +
      "3. Tertiary\n" +
      "   - Stakeholders with low direct influence or impact; important for reputation, symbolic value, or long-term strategy.\n" +
      "   - Engagement is representative, periodic, or goodwill-based.",
  },
  {
    question: "What is Location?",
    answer:
      "• Location is the geographical area where the stakeholder is based or operates their activities.",
  },
  {
    question: "What is Contact?",
    answer: "• Contact refers to relevant information for communication, such as phone number or email.",
  },
  {
    question: "What is Engagement Priority?",
    answer: "• Engagement Priority refers to the urgency or importance of engaging with this stakeholder.",
  },
  {
    question: "What is Engagement Relevance?",
    answer:
      "• Engagement Relevance measures how much influence or impact the stakeholder has on the project or organizational activities.",
  },
  {
    question: "What is Engagement Frequency?",
    answer: "• Engagement Frequency describes how often you interact or communicate with the stakeholder.",
  },
  {
    question: "What is Engagement Strategy?",
    answer:
      "• Engagement Strategy is the method or approach used to build, maintain, and manage stakeholder relationships.",
  },
  {
    question: "What are Key Concerns?",
    answer:
      "• Key Concerns are the main issues, expectations, or worries raised by stakeholders during engagement.",
  },
  {
    question: "What is a Mitigation Plan?",
    answer:
      "• Mitigation Plan is the actions or efforts planned to address and respond to stakeholder issues and concerns.",
  },
  {
    question: "What is the Objective?",
    answer: "• Objective is the purpose or result you want to achieve by engaging with the stakeholder.",
  },
  {
    question: "What is the Recommended Focal Point?",
    answer:
      "• Recommended Focal Point is the main person recommended to be the liaison or contact for stakeholder relations.",
  },
  {
    question: "What is a Backup / Support Focal Point?",
    answer:
      "• Backup / Support Focal Point is a supporting or backup person who can help or substitute for the main focal point if needed.",
  },
  {
    question: "What is a Re-engagement Trigger?",
    answer:
      "• Re-engagement Trigger refers to a condition or event requiring renewed stakeholder engagement.",
  },
  {
    question: "What are Trigger Reasons?",
    answer:
      "• Trigger Reasons are the explanations or background causes that make re-engagement with stakeholders necessary.",
  },
  // Tambahkan pertanyaan lainnya jika perlu
];

export default function FaqModal() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Reset open accordion item whenever the search term changes so the
    // open index doesn't accidentally point to a different FAQ once the
    // filtered list changes.
    setOpenIndex(null);
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredFaqs = normalizedSearch
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(normalizedSearch) ||
          faq.answer.toLowerCase().includes(normalizedSearch)
      )
    : faqs;

  return (
    <div className="min-h-screen bg-gradient-subtle py-12 px-4 sm:px-6 lg:px-8 pt-20">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-foreground mb-4"
          >
            Frequently Asked <span className="text-gradient">Questions</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-24 h-1 bg-gradient-primary mx-auto mb-6 rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Find answers to common questions about stakeholder management and engagement
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-input w-full pl-10 pr-4 py-3 rounded-xl border-2 border-muted focus:border-primary transition-colors duration-300"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="space-y-4"
        >
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-muted-foreground text-lg">No FAQ found</p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="enhanced-card overflow-hidden"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left p-6 flex justify-between items-center hover:bg-muted/50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <span className="text-lg font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-border">
                        <div className="prose max-w-none">
                          {faq.answer.split("\n").map((line, i) => (
                            <motion.p
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: i * 0.1 }}
                              className="text-muted-foreground leading-relaxed mb-2 last:mb-0"
                            >
                              {line}
                            </motion.p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </motion.div>

      </motion.div>
    </div>
  );
}
