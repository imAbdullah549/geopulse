import * as React from "react";
import { trackException } from "@/lib/telemetry";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: unknown, info: React.ErrorInfo) => void;
};

type State = {
  hasError: boolean;
  error?: unknown;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    // UI crash telemetry (render/runtime errors)
    try {
      trackException(error, {
        area: "ui",
        componentStack: info.componentStack,
      });
    } catch {
      // never break the app due to telemetry
    }

    this.props.onError?.(error, info);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">
          An unexpected error occurred while rendering this page.
        </p>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="inline-flex items-center rounded-md border px-3 py-2 text-sm"
            onClick={this.handleReset}
          >
            Try again
          </button>

          <button
            type="button"
            className="inline-flex items-center rounded-md border px-3 py-2 text-sm"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
