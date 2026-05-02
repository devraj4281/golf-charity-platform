"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center animate-in fade-in-50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-6">
            <AlertTriangle className="h-10 w-10 text-destructive" strokeWidth={1.5} />
          </div>
          <h3 className="mb-2 text-2xl font-heading font-semibold tracking-tight text-destructive">
            Something went wrong
          </h3>
          <p className="mb-8 max-w-sm text-sm text-muted-foreground leading-relaxed">
            {this.state.error?.message || "An unexpected error occurred. Please try again later."}
          </p>
          <Button 
            variant="outline" 
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
