import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "../../skeleton";

export function ModernCardSkeleton() {
  return (
    <Card className="w-full h-[350px] animate-pulse rounded-2xl shadow-md">
      <CardContent className="p-6 space-y-13">
        {/* Title */}
        <Skeleton className="h-6 w-2/3 bg-gray-300 rounded"/>

        {/* Subtitle */}
        <Skeleton className="h-4 w-1/2 bg-gray-300 rounded"/>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full bg-gray-200 rounded"/>
          <Skeleton className="h-3 w-5/6 bg-gray-200 rounded"/>
          <Skeleton className="h-3 w-2/3 bg-gray-200 rounded"/>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Skeleton className="h-5 w-12 bg-gray-200 rounded-full"/>
          <Skeleton className="h-5 w-16 bg-gray-200 rounded-full"/>
          <Skeleton className="h-5 w-20 bg-gray-200 rounded-full"/>
        </div>
      </CardContent>
    </Card>
  );
}
