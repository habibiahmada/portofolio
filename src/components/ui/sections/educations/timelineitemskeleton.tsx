import { ModernCardSkeleton } from "./moderncardskeleton";

export function TimelineItemSkeleton({ index }: { index: number }) {
    const isLeft = index % 2 === 0;
  
    return (
      <div
        className="relative"
        style={{ transitionDelay: `${index * 200}ms` }}
      >
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center">
          {/* Timeline Dot */}
          <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
            <div className="w-3 h-3 bg-gray-400 rounded-full ring-4 ring-gray-200 animate-pulse"></div>
          </div>
  
          {/* Left Side */}
          <div className="w-full pr-8 xl:pr-12">
            {isLeft && (
              <div className="flex justify-end">
                <ModernCardSkeleton />
              </div>
            )}
          </div>
  
          {/* Right Side */}
          <div className="w-full pl-8 xl:pl-12">
            {!isLeft && <ModernCardSkeleton />}
          </div>
        </div>
  
        {/* Mobile Layout */}
        <div className="block lg:hidden">
          {/* Mobile Dot */}
          <div className="absolute left-6 transform -translate-x-1/2 z-20">
            <div className="w-3 h-3 bg-gray-400 rounded-full ring-2 ring-gray-200 animate-pulse"></div>
          </div>
  
          <div className="ml-12 sm:ml-16">
            <ModernCardSkeleton />
          </div>
        </div>
      </div>
    );
  }
  