import DashboardHeader from "@/components/ui/sections/admin/dashboardheader";
import { MessageSquare } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getMessageData } from "@/services/api/admin/getmessagedata";
import { timeAgo } from "@/lib/getTimes";

export default async function Page({ params }: { params: { locale: string } }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Dashboard.contacts' });
    const tc = await getTranslations({ locale, namespace: 'Common' });
    const { messages } = await getMessageData()
    return (
        <>
            <div className="min-h-screen">
                <DashboardHeader
                    title={t('title')}
                    description={t('description')}
                />

                <div className="lg:col-span-2 bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-foreground">{t('title')}</h2>
                        <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-3 mb-4">
                        {messages.length > 0 ? (
                            messages.map((message: { id: string; name: string; email: string; created_at: string; subject?: string; message?: string }) => (
                                <div key={message.id} className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                {message.name.substring(0, 2)}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-foreground text-sm">{message.name}</h4>
                                                <p className="text-xs text-muted-foreground">{message.email}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {timeAgo(message.created_at, tc)}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-foreground mb-1">{message.subject}</p>
                                    <p className="text-xs text-muted-foreground/80 line-clamp-2">{message.message}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                {t('empty')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}