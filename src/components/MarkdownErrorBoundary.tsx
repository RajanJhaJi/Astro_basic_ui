import { Component, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class MarkdownErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <p className="text-red-500">Error rendering markdown content</p>;
    }

    return (
      <MarkdownErrorBoundary>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="leading-relaxed">{children}</p>,
            pre: ({ children }) => <pre className="p-0">{children}</pre>,
          }}
        >
          {this.props.children}
        </ReactMarkdown>
      </MarkdownErrorBoundary>
    );
  }
}
