import ReactMarkdown from "react-markdown";

interface MarkdownProps {
  children: string;
  className?: string;
  inline?: boolean;
}

export default function Markdown({ children, className = "", inline = true }: MarkdownProps) {
  const Wrapper = inline ? 'span' : 'div';
  return (
    <Wrapper className={className}>
      <ReactMarkdown
        components={{
          p: ({ children }) => inline ? <span>{children}</span> : <p className="mb-3 last:mb-0">{children}</p>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 hover:text-blue-800 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="list-disc list-outside ml-5 space-y-2 my-3">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-outside ml-5 space-y-2 my-3">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
        }}
      >
        {children}
      </ReactMarkdown>
    </Wrapper>
  );
}
