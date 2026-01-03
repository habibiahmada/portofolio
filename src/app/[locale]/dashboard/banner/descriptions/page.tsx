"use client";

import DashboardHeader from "@/components/ui/sections/admin/dashboardheader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useHeroEditor } from "./hooks/useHeroEditor";
import { HeroContentCard } from "./components/herocontentcard";
import { HeroTypewriterCard } from "./components/herotypewritercard";
import { HeroCVCard } from "./components/herocvcard";

export default function Page() {
  const { t, saving, hasChanges, state, actions } = useHeroEditor();

  return (
    <div className="min-h-screen space-y-6">
      <DashboardHeader title={t("title")} description={t("subtitle")} />

      <HeroContentCard
        t={t}
        greeting={state.greeting}
        description={state.description}
        developerTag={state.developerTag}
        consoleTag={state.consoleTag}
        onGreetingChange={actions.setGreeting}
        onDescriptionChange={actions.setDescription}
        onDeveloperTagChange={actions.setDeveloperTag}
        onConsoleTagChange={actions.setConsoleTag}
      />

      <HeroTypewriterCard
        t={t}
        items={state.typewriterTexts}
        onChange={actions.setTypewriterTexts}
      />

      <HeroCVCard
        t={t}
        cvUrl={state.cvUrl}
        selectedFile={state.selectedCVFile}
        onSelect={actions.setSelectedCVFile}
      />

      <div className="flex justify-end gap-3 pt-6">
        {hasChanges && <Badge variant="secondary">{t("actions.unsavedChanges")}</Badge>}
        <Button variant="outline" disabled={!hasChanges || saving} onClick={actions.reset}>
          {t("actions.reset")}
        </Button>
        <Button disabled={!hasChanges || saving} onClick={actions.save}>
          {saving ? t("actions.saving") : t("actions.save")}
        </Button>
      </div>
    </div>
  );
}
