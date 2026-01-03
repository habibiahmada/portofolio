import {
  FolderOpen,
  FileText,
  GraduationCap,
  Award,
  MessageSquare,
  Mail,
  Plus,
  Users,
  Wrench,
  BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import DashboardHeader from '@/components/ui/sections/admin/dashboardheader'
import { getTranslations } from 'next-intl/server'
import { getDashboardData } from '@/services/api/admin/getdashboarddata'
import { timeAgo } from '@/lib/getTimes'

// Force dynamic rendering since we are fetching data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Dashboard' });
  const tc = await getTranslations({ locale, namespace: 'Common' });
  const { counts, messages } = await getDashboardData()

  return (
    <div className="min-h-screen space-y-6 relative">
      <DashboardHeader
        title={t('header.title')}
        description={t('header.description')}
      />

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={FolderOpen}
          title={t('stats.projects')}
          value={counts.projects}
          color="blue"
          href="/dashboard/projects"
        />
        <StatCard
          icon={FileText}
          title={t('stats.articles')}
          value={counts.articles}
          color="green"
          href="/dashboard/articles"
        />
        <StatCard
          icon={BookOpen}
          title={t('stats.services')}
          value={counts.services}
          color="orange"
          href="/dashboard/services"
        />
        <StatCard
          icon={Wrench}
          title={t('stats.tools')}
          value={counts.tools}
          color="purple"
          href="/dashboard/tools-tech"
        />
        <StatCard
          icon={GraduationCap}
          title={t('stats.experience')}
          value={counts.experiences}
          color="indigo"
          href="/dashboard/exp-edu"
        />
        <StatCard
          icon={Award}
          title={t('stats.certifications')}
          value={counts.certifications}
          color="yellow"
          href="/dashboard/certificates"
        />
        <StatCard
          icon={Users}
          title={t('stats.testimonials')}
          value={counts.testimonials}
          color="pink"
          href="/dashboard/testimonials"
        />
        <StatCard
          icon={Mail}
          title={t('stats.messages')}
          value={counts.messages}
          color="red"
          href="/dashboard/contacts"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Recent Messages */}
        <div className="lg:col-span-2 bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">{t('recentMessages.title')}</h2>
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
                {t('recentMessages.empty')}
              </div>
            )}
          </div>
          <Link href="/dashboard/contacts">
            <Button variant="outline" className="w-full" aria-label={t('recentMessages.viewAll')}>
              {t('recentMessages.viewAll')}
            </Button>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border h-fit">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">{t('quickActions.title')}</h2>
          <div className="flex flex-col gap-3">
            <QuickActionButton
              label={t('quickActions.addProject')}
              href="/dashboard/projects/new"
              color="blue"
            />
            <QuickActionButton
              label={t('quickActions.addArticle')}
              href="/dashboard/articles/new"
              color="green"
            />
            <QuickActionButton
              label={t('quickActions.addService')}
              href="/dashboard/services/new"
              color="orange"
            />
            <QuickActionButton
              label={t('quickActions.addTool')}
              href="/dashboard/tools-tech"
              color="purple"
            />
            <QuickActionButton
              label={t('quickActions.addCertification')}
              href="/dashboard/certificates/new"
              color="yellow"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, title, value, color = "blue", href }: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  value: string | number
  color?: "blue" | "green" | "purple" | "yellow" | "pink" | "red" | "orange" | "indigo"
  href: string
}) {
  const colorStyles = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  }

  return (
    <Link href={href} className="block group">
      <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border hover:shadow-md transition-shadow h-full">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className={`p-2 sm:p-3 rounded-lg ${colorStyles[color]} transition-colors`}>
            <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{value}</h3>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </Link>
  )
}

function QuickActionButton({ label, href, color = "blue" }: {
  label: string
  href: string
  color?: "blue" | "green" | "purple" | "yellow" | "pink" | "red" | "orange"
}) {
  const colorStyles = {
    blue: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    green: 'hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
    purple: 'hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    yellow: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    pink: 'hover:bg-pink-50 dark:hover:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800',
    red: 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    orange: 'hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  }

  return (
    <Link href={href} className="w-full">
      <Button
        variant="outline"
        className={`w-full justify-start gap-2 h-auto py-3 ${colorStyles[color]}`}
        aria-label={label}
      >
        <Plus className="h-4 w-4" />
        <span>{label}</span>
      </Button>
    </Link>
  )
}