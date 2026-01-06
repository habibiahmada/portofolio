export default function PortalCardSkeleton() {
    return (
        <>
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="h-[450px] rounded-3xl bg-slate-200 dark:bg-slate-900 animate-pulse"
                />
            ))}
        </>
    );
}