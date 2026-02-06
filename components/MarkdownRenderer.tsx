import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
    // Determine if content acts "inline" (no block p tags) or "block"
    // But typically we want standard block rendering for questions.

    return (
        <div className={`prose prose-slate max-w-none ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    // Override default paragraph to avoid nesting issues if needed, 
                    // or just let it interpret naturally.
                    // For now, default rendering is usually fine for questions.
                    img: ({ node, ...props }) => (
                        <img {...props} className="rounded-lg max-h-96 object-contain border border-slate-100 bg-slate-50 my-4" />
                    )
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
