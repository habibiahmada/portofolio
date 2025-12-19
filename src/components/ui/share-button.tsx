'use client';

import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonProps {
    title?: string;
    label: string;
}

export default function ShareButton({ title, label }: ShareButtonProps) {
    const handleShare = () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            navigator.share({
                title: title,
                url: window.location.href,
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleShare}
        >
            <Share2 className="w-4 h-4" />
            {label}
        </Button>
    );
}
