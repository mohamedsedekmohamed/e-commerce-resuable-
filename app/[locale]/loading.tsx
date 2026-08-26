export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-md flex flex-col items-center justify-center min-h-[100dvh]">
      <div className="relative flex flex-col items-center justify-center gap-6">
        
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 blur-[60px] rounded-full animate-pulse"></div>
        
        {/* Creative Heartbeat SVG */}
        <div className="relative w-48 h-24 flex items-center justify-center">
          <svg 
            className="w-full h-full drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]"
            viewBox="0 0 100 50" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Faded background line */}
            <path 
              className="text-primary/10"
              d="M 0 25 H 30 L 35 15 L 45 40 L 55 5 L 65 35 L 70 25 H 100" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            
            {/* Animated foreground line */}
            <path 
              className="text-primary"
              d="M 0 25 H 30 L 35 15 L 45 40 L 55 5 L 65 35 L 70 25 H 100" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              strokeDasharray="150"
              strokeDashoffset="150"
            >
              <animate 
                attributeName="stroke-dashoffset" 
                values="150;0;150" 
                dur="2s" 
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
              />
            </path>
          </svg>
        </div>

        {/* Loading text with animated dots */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center font-bold text-foreground/80 tracking-[0.2em] uppercase text-sm">
            <span>Loading</span>
            <span className="flex gap-1 ml-2 mt-1">
              <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </span>
          </div>
          <span className="text-[10px] text-foreground/40 uppercase tracking-widest font-medium">Your Trusted Pharmacy</span>
        </div>

      </div>
    </div>
  );
}
