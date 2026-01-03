interface Props {
  i: number;
}

export default function Skeletonlogolist({ i }: Props) {
  return (
    <div
      key={i}
      className={`h-12 min-w-[120px] mx-8 flex items-center justify-center animate-pulse`}
    >
      <div className="w-24 h-8 rounded bg-slate-200 dark:bg-slate-800 opacity-50" />
    </div>
  )
}