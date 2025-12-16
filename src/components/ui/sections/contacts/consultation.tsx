'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Consultation: React.FC = () => {
  const t = useTranslations("contacts");

  return (
    <Card className="bg-white border border-slate-200 dark:bg-slate-950 dark:border-slate-800 backdrop-blur-xl shadow-lg">
      <CardContent className="p-8">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 group-hover:scale-110">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-blue-800 dark:text-blue-100 text-lg mb-2">
              {t('consultation.title')}
            </h4>
            <p className="text-blue-600/80 dark:text-blue-200/80 mb-6 leading-relaxed">
              {t('consultation.description')}
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {t('consultation.bookButton')}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <DialogHeader>
                  <DialogTitle className="text-slate-800 dark:text-white">{t('consultation.dialog.title')}</DialogTitle>
                  <DialogDescription className="text-slate-600 dark:text-slate-400">
                    {t('consultation.dialog.description')}
                  </DialogDescription>
                </DialogHeader>
                <div className="text-slate-600 dark:text-slate-400">
                  <p>{t('consultation.dialog.placeholder')}</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Consultation;
