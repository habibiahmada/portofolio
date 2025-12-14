import { Typewriter } from "react-simple-typewriter";

interface Props {
  isDark: boolean;
  texts: string[];
}

export default function Writertext({ isDark, texts }: Props) {
  return (
    <span className={isDark ? "text-white" : "text-slate-900"}>
      <Typewriter
        words={texts}
        loop={true}
        cursor
        cursorStyle="|"
        typeSpeed={80}
        deleteSpeed={20}
        delaySpeed={2000}
      />
    </span>
  )
}