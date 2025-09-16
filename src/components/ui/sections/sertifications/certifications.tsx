'use client';

import React, { useState } from 'react';
import {
  Zap,
  Cloud,
  Gauge,
  Palette,
  FileCode,
  Figma,
  X,
  ExternalLink,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

// Type Certificate
interface Certificate {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description: string;
  icon: React.ReactNode;
  color: 'blue' | 'slate';
  preview: string;
  skills: string[];
}

const certificates: Certificate[] = [
  {
    id: 'react-meta',
    title: 'React Developer Certification',
    issuer: 'Meta',
    year: '2023',
    description:
      'Advanced React development, hooks, state management, dan performance optimization.',
    icon: <Zap className="w-6 h-6" />,
    color: 'blue',
    preview: '/certificates/react-meta-preview.jpg',
    skills: ['React Hooks', 'State Management', 'Performance Optimization', 'Component Architecture'],
  },
  {
    id: 'aws-solutions',
    title: 'AWS Solutions Architect',
    issuer: 'Amazon Web Services',
    year: '2023',
    description: 'Cloud architecture, deployment strategies, dan AWS services implementation.',
    icon: <Cloud className="w-6 h-6" />,
    color: 'slate',
    preview: '/certificates/aws-solutions-preview.jpg',
    skills: ['Cloud Architecture', 'AWS Services', 'Deployment', 'Scalability'],
  },
  {
    id: 'google-ux',
    title: 'UX Design Professional',
    issuer: 'Google',
    year: '2022',
    description:
      'User experience design, prototyping, user research, dan usability testing.',
    icon: <Palette className="w-6 h-6" />,
    color: 'blue',
    preview: '/certificates/google-ux-preview.jpg',
    skills: ['User Research', 'Prototyping', 'Usability Testing', 'Design Systems'],
  },
  {
    id: 'freecodecamp-js',
    title: 'JavaScript Algorithms',
    issuer: 'freeCodeCamp',
    year: '2022',
    description:
      'Advanced JavaScript, algorithms, data structures, dan problem solving.',
    icon: <FileCode className="w-6 h-6" />,
    color: 'slate',
    preview: '/certificates/freecodecamp-js-preview.jpg',
    skills: ['JavaScript ES6+', 'Algorithms', 'Data Structures', 'Problem Solving'],
  },
  {
    id: 'figma-advanced',
    title: 'Advanced Figma',
    issuer: 'Figma Academy',
    year: '2022',
    description:
      'Advanced prototyping, design systems, component libraries, dan collaboration.',
    icon: <Figma className="w-6 h-6" />,
    color: 'blue',
    preview: '/certificates/figma-advanced-preview.jpg',
    skills: ['Advanced Prototyping', 'Design Systems', 'Component Libraries', 'Team Collaboration'],
  },
  {
    id: 'google-performance',
    title: 'Web Performance',
    issuer: 'Google PageSpeed',
    year: '2021',
    description:
      'Core Web Vitals, performance optimization, dan speed improvement techniques.',
    icon: <Gauge className="w-6 h-6" />,
    color: 'slate',
    preview: '/certificates/google-performance-preview.jpg',
    skills: ['Core Web Vitals', 'Performance Optimization', 'Speed Improvement', 'SEO'],
  },
];

const CertificateModal: React.FC<{ certificate: Certificate | null; onClose: () => void }> = ({
  certificate,
  onClose,
}) => {
  if (!certificate) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl ${
                certificate.color === 'blue'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {certificate.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {certificate.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {certificate.issuer} • {certificate.year}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8 mb-6">
              <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-lg">
                <div className="text-center">
                  <div
                    className={`inline-block p-4 rounded-full mb-4 ${
                      certificate.color === 'blue'
                        ? 'bg-blue-100 dark:bg-blue-900/30'
                        : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    {certificate.icon}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Certificate of Completion
                  </h4>
                  <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
                    {certificate.title}
                  </p>
                  <div
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                      certificate.color === 'blue'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-600 text-white'
                    }`}
                  >
                    {certificate.issuer} • {certificate.year}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Deskripsi
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {certificate.description}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Skills yang Dipelajari
              </h4>
              <div className="flex flex-wrap gap-2">
                {certificate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      certificate.color === 'blue'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CertificationCard: React.FC<{ certificate: Certificate; onClick: () => void }> = ({
  certificate,
  onClick,
}) => {
  return (
    <div
      className="group relative bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
    >
      {/* Card Preview */}
      <div className="h-48 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative overflow-hidden cursor-pointer"
      onClick={onClick}
      >
        <div
          className={`absolute inset-0 opacity-10 ${
            certificate.color === 'blue'
              ? 'bg-gradient-to-br from-blue-400 to-blue-600'
              : 'bg-gradient-to-br from-slate-400 to-slate-600'
          }`}
        />
        <div className="relative z-10 text-center">
          <div
            className={`inline-block p-6 rounded-full mb-4 ${
              certificate.color === 'blue'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            } group-hover:scale-110 transition-transform duration-300`}
          >
            {certificate.icon}
          </div>
          <div
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              certificate.color === 'blue'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-600 text-white'
            }`}
          >
            CERTIFICATE
          </div>
        </div>
        <div className="absolute inset-0 bg-blue-600/20 dark:bg-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 dark:bg-slate-900/90 rounded-full p-3">
            <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`p-3 rounded-xl ${
              certificate.color === 'blue'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {certificate.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {certificate.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              {certificate.issuer} • {certificate.year}
            </p>
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
          {certificate.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {certificate.skills.slice(0, 2).map((skill, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-md text-xs font-medium ${
                certificate.color === 'blue'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {skill}
            </span>
          ))}
          {certificate.skills.length > 2 && (
            <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              +{certificate.skills.length - 2} more
            </span>
          )}
        </div>
        <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer"
        onClick={onClick}>
          <ExternalLink className="w-4 h-4" />
          <span className="font-medium text-sm">Lihat Sertifikat</span>
        </button>
      </div>
    </div>
  );
};

const CertificationsSection: React.FC = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const t = useTranslations("certifications");

  return (
    <>
    <section
    className="relative overflow-hidden transition-all duration-700 py-28 sm:py-36 lg:py-40 pb-0 
    bg-slate-50 dark:bg-slate-950"
    >
    <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
        <h2 
            className="block font-extrabold leading-tight 
            text-4xl sm:text-5xl lg:text-6xl 
            bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 
            bg-clip-text text-transparent mb-4 sm:mb-6">
            {t("titleLine1")}
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t("description1")}
        </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certificates.map((certificate) => (
            <CertificationCard
            key={certificate.id}
            certificate={certificate}
            onClick={() => setSelectedCertificate(certificate)}
            />
        ))}
        </div>
    </div>
    </section>
      <CertificateModal certificate={selectedCertificate} onClose={() => setSelectedCertificate(null)} />
    </>
  );
};

export default CertificationsSection;