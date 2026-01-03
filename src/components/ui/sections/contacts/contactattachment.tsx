import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface Props {
  onChange: (file: File | null) => void;
}

export default function ContactAttachment({ onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label>Attachment</Label>
      <div className="relative">
        <Input
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          onChange={e => onChange(e.target.files?.[0] || null)}
        />
        <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
}
