import { useTranslations } from "next-intl";
import { Typewriter } from "react-simple-typewriter";

interface Props {
    isDark: boolean;
}

export default function Writertext({isDark}: Props){

  const t = useTranslations('hero')
    
  const typewriterTexts = [
    t('typewriterTexts.0'),
    t('typewriterTexts.1'),
    t('typewriterTexts.2'),
    t('typewriterTexts.3'),
    t('typewriterTexts.4')
  ];

    return(
        <span className={isDark ? "text-white" : "text-slate-900"}>
        <Typewriter
          words={typewriterTexts}
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