import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function ContactService({ value, onChange }: Props) {
  const t = useTranslations('contacts');

  const services = [
    { value: 'frontend', label: t('services.frontend') },
    { value: 'uiux', label: t('services.uiux') },
    { value: 'performance', label: t('services.performance') },
    { value: 'webapp', label: t('services.webapp') },
    { value: 'consulting', label: t('services.consulting') },
    { value: 'other', label: t('services.other') },
  ];

  return (
    <div className="space-y-2">
      <Label>{t('form.subject.label')} *</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={t('form.subject.placeholder')} />
        </SelectTrigger>
        <SelectContent>
          {services.map(s => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
