'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Unlink,
    Minus,
    CodeSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCallback } from 'react';

interface TiptapEditorProps {
    content?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
    className?: string;
    editable?: boolean;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    const setLink = useCallback(() => {
        if (!editor) return;

        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) return;

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30 rounded-t-md">
            {/* Text formatting */}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn('h-8 w-8 p-0', editor.isActive('bold') && 'bg-accent')}
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn('h-8 w-8 p-0', editor.isActive('italic') && 'bg-accent')}
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={cn('h-8 w-8 p-0', editor.isActive('strike') && 'bg-accent')}
            >
                <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={cn('h-8 w-8 p-0', editor.isActive('code') && 'bg-accent')}
            >
                <Code className="h-4 w-4" />
            </Button>

            <div className="w-px h-8 bg-border mx-1" />

            {/* Headings */}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={cn('h-8 w-8 p-0', editor.isActive('heading', { level: 1 }) && 'bg-accent')}
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn('h-8 w-8 p-0', editor.isActive('heading', { level: 2 }) && 'bg-accent')}
            >
                <Heading2 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={cn('h-8 w-8 p-0', editor.isActive('heading', { level: 3 }) && 'bg-accent')}
            >
                <Heading3 className="h-4 w-4" />
            </Button>

            <div className="w-px h-8 bg-border mx-1" />

            {/* Lists */}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn('h-8 w-8 p-0', editor.isActive('bulletList') && 'bg-accent')}
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn('h-8 w-8 p-0', editor.isActive('orderedList') && 'bg-accent')}
            >
                <ListOrdered className="h-4 w-4" />
            </Button>

            <div className="w-px h-8 bg-border mx-1" />

            {/* Block elements */}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn('h-8 w-8 p-0', editor.isActive('blockquote') && 'bg-accent')}
            >
                <Quote className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={cn('h-8 w-8 p-0', editor.isActive('codeBlock') && 'bg-accent')}
            >
                <CodeSquare className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="h-8 w-8 p-0"
            >
                <Minus className="h-4 w-4" />
            </Button>

            <div className="w-px h-8 bg-border mx-1" />

            {/* Link */}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={setLink}
                className={cn('h-8 w-8 p-0', editor.isActive('link') && 'bg-accent')}
            >
                <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().unsetLink().run()}
                disabled={!editor.isActive('link')}
                className="h-8 w-8 p-0"
            >
                <Unlink className="h-4 w-4" />
            </Button>

            <div className="w-px h-8 bg-border mx-1" />

            {/* Undo/Redo */}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="h-8 w-8 p-0"
            >
                <Undo className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="h-8 w-8 p-0"
            >
                <Redo className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default function TiptapEditor({
    content = '',
    onChange,
    placeholder = 'Start writing...',
    className,
    editable = true,
}: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
                    'prose-headings:font-semibold prose-headings:tracking-tight',
                    'prose-p:leading-7',
                    'prose-a:text-primary prose-a:underline',
                    'prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:pl-4 prose-blockquote:italic',
                    'prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
                    'prose-pre:bg-muted prose-pre:rounded-lg'
                ),
            },
        },
        immediatelyRender: false,
    });

    return (
        <div className={cn('border rounded-md bg-background', className)}>
            {editable && <MenuBar editor={editor} />}
            <EditorContent editor={editor} />
        </div>
    );
}
