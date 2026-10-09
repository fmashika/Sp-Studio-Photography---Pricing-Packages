import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public props: Props;
  public state: State;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SP Studio Uncaught Exception:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-16 h-16 rounded-2xl bg-[#eab308]/15 border border-[#eab308]/30 flex items-center justify-center text-[#eab308] mb-6 shadow-[0_0_25px_rgba(234,179,8,0.2)]">
            <span className="text-2xl font-black">SP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest mb-3 text-white">
            SP STUDIO
          </h1>
          <p className="text-gray-400 text-sm max-w-md mb-8 leading-relaxed">
            We encountered a temporary display issue. Tap reload below to refresh the pricing packages.
          </p>
          <button
            onClick={this.handleReload}
            className="px-8 py-3.5 rounded-xl bg-[#eab308] hover:bg-white text-black font-extrabold uppercase tracking-wider text-xs shadow-lg shadow-[#eab308]/20 transition-all cursor-pointer active:scale-95"
          >
            Reload Website
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
