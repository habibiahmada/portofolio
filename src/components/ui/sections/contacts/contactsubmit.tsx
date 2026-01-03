import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface Props {
  loading: boolean;
  disabled: boolean;
}

export default function ContactSubmit({ loading, disabled }: Props) {
  return (
    <Button
      type="submit"
      disabled={disabled || loading}
      className="w-full py-6 text-lg"
    >
      {loading ? (
        <span className="animate-pulse">Sending...</span>
      ) : (
        <span className="flex items-center gap-2">
          <Send className="w-4 h-4" />
          Send Message
        </span>
      )}
    </Button>
  );
}
