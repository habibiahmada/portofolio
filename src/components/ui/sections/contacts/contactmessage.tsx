import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function ContactMessage({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label>Message *</Label>
      <Textarea
        rows={6}
        value={value}
        onChange={e => onChange(e.target.value)}
        required
      />
    </div>
  );
}
