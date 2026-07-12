import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './AboutPage.css';
import dev1 from '../assets/dev1.jpg';
import dev2 from '../assets/dev2.jpg';
import dev3 from '../assets/dev3.jpg';
import dev4 from '../assets/dev4.jpg';
import dev5 from '../assets/dev5.jpg';

export default function AboutPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('visi');

  const developers = [
    { name: 'Farah Nasywa', roleKey: 'frontend', image: dev1 },
    { name: 'Siska Auliani', roleKey: 'frontend', image: dev2 },
    { name: 'Cut Sula Fathia Rahma', roleKey: 'data', image: dev3 },
    { name: 'Fathiya Namira Fardhi', roleKey: 'backend', image: dev4 },
    { name: 'Iwani Khairina', roleKey: 'uiux', image: dev5 },
  ];

  const tabContent = {
    visi: t('about.tabContent.visi'),
    misi: t('about.tabContent.misi'),
    goals: t('about.tabContent.goals'),
  };

  const stats = [
    { number: '5', label: t('about.stats.teamMembers'), icon: '👥' },
    { number: '100%', label: t('about.stats.dedication'), icon: '🎯' },
    { number: '1', label: t('about.stats.sharedVision'), icon: '🚀' },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative py-20 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-foreground mb-6"
            >
              <span className="text-gradient">{t('about.heroTitle1')}</span>
              <br />
              <span className="text-muted-foreground">{t('about.heroTitle2')}</span>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-32 h-1 bg-gradient-primary mx-auto mb-8 rounded-full"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8"
            >
              {t('about.heroParagraph1')}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              {t('about.heroParagraph2')}
            </motion.p>
          </div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex justify-center mb-12"
          >
            <div className="flex space-x-2 p-2 bg-muted rounded-xl">
              {['visi', 'misi', 'goals'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-gradient-primary text-white shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background'
                  }`}
                >
                  {t(`about.tabs.${tab}`)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="enhanced-card p-8 max-w-4xl mx-auto">
              <p className="text-lg text-foreground leading-relaxed">
                {tabContent[activeTab]}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <div className="divider-banner">
        <div className="divider-content">
          <div className="divider-track">
            {Array.from({ length: 6 }).map((_, i) => (
              <span className="divider-text" key={i}>{t('about.meetOurTeam')}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <section className="py-20 px-8 bg-background/50">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              {t('about.teamHeading1')} <span className="text-gradient">{t('about.teamHeading2')}</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {developers.map((dev, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="enhanced-card p-6 text-center hover-lift group"
              >
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                    <img
                      src={dev.image}
                      alt={dev.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {dev.name}
                </h3>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {t(`about.roles.${dev.roleKey}`)}
                </p>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-primary opacity-60" />
                    <div className="w-2 h-2 rounded-full bg-gradient-primary opacity-40" />
                    <div className="w-2 h-2 rounded-full bg-gradient-primary opacity-60" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="enhanced-card p-6 text-center">
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-gradient mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
