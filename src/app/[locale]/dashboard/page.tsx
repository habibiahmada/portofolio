'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FolderOpen, 
  FileText, 
  GraduationCap, 
  Award, 
  MessageSquare, 
  Mail,
  Plus,
  Eye,
  Clock,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Mock data - replace with actual API calls
const mockData = {
  stats: {
    projects: { total: 12, recent: 3, trend: '+2 this week' },
    articles: { total: 24, recent: 'React Best Practices', trend: '+1 this week' },
    experience: { total: 8, recent: 'Senior Developer', trend: '2 positions' },
    certifications: { total: 15, active: 12, expired: 3, trend: '3 expiring soon' },
    testimonials: { total: 28, pending: 5, trend: '+2 this month' },
    messages: { total: 47, unread: 8, read: 39, trend: '+5 today' }
  },
  recentActivity: [
    { id: 1, action: 'Project "E-commerce Dashboard" ditambahkan', time: '2 hours ago', type: 'project' },
    { id: 2, action: 'Sertifikat "AWS Solutions Architect" diperbarui', time: '1 day ago', type: 'cert' },
    { id: 3, action: 'Artikel "Next.js 14 Features" dipublikasi', time: '2 days ago', type: 'article' },
    { id: 4, action: 'Testimoni baru dari John Doe diterima', time: '3 days ago', type: 'testimonial' },
    { id: 5, action: 'Pengalaman "Full Stack Developer" ditambahkan', time: '1 week ago', type: 'experience' }
  ],
  messages: [
    { 
      id: 1, 
      name: 'John Smith', 
      email: 'j***@gmail.com', 
      subject: 'Project Collaboration Inquiry',
      preview: 'Hi, I saw your portfolio and would like to discuss...',
      status: 'new',
      time: '1 hour ago'
    },
    { 
      id: 2, 
      name: 'Aisyah Rahman', 
      email: 'a***@company.com', 
      subject: 'Web Development Quote',
      preview: 'Could you provide a quote for developing...',
      status: 'read',
      time: '3 hours ago'
    },
    { 
      id: 3, 
      name: 'Michael Chen', 
      email: 'm***@startup.io', 
      subject: 'Technical Consultation',
      preview: 'We need help with our React application...',
      status: 'new',
      time: '1 day ago'
    },
    { 
      id: 4, 
      name: 'Sarah Wilson', 
      email: 's***@agency.com', 
      subject: 'Partnership Opportunity',
      preview: 'Our agency is looking for talented developers...',
      status: 'read',
      time: '2 days ago'
    }
  ]
}

export default function DashboardPage() {
  const [data, setData] = useState(mockData)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </div>
    )
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = "blue" }: {
    icon: React.ComponentType<{ className?: string }>
    title: string
    value: string | number
    subtitle: string
    trend: string
    color?: "blue" | "green" | "purple" | "yellow" | "pink" | "red"
  }) => (
    <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-lg ${
          color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
          color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
          color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
          color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
          color === 'pink' ? 'bg-pink-100 dark:bg-pink-900/30' :
          'bg-red-100 dark:bg-red-900/30'
        }`}>
          <Icon className={`h-4 w-4 sm:h-6 sm:w-6 ${
            color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
            color === 'green' ? 'text-green-600 dark:text-green-400' :
            color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
            color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
            color === 'pink' ? 'text-pink-600 dark:text-pink-400' :
            'text-red-600 dark:text-red-400'
          }`} />
        </div>
        <span className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
          {trend}
        </span>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground/70">{subtitle}</p>
    </div>
  )

  const QuickActionButton = ({ icon: Icon, label, onClick, color = "blue" }: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    onClick: () => void
    color?: "blue" | "green" | "purple" | "yellow" | "pink" | "red"
  }) => (
    <Button 
      onClick={onClick}
      className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-white rounded-lg transition-all duration-200 hover:scale-105 ${
        color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700' :
        color === 'green' ? 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700' :
        color === 'purple' ? 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700' :
        color === 'pink' ? 'bg-pink-600 hover:bg-pink-700 dark:bg-pink-600 dark:hover:bg-pink-700' :
        'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-600 dark:hover:bg-yellow-700'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="font-medium text-sm sm:text-base">{label}</span>
    </Button>
  )

  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-6 p-2 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Welcome back! Here's what's happening with your portfolio.</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <StatCard 
          icon={FolderOpen}
          title="Projects"
          value={data.stats.projects.total}
          subtitle={`${data.stats.projects.recent} recent projects`}
          trend={data.stats.projects.trend}
          color="blue"
        />
        <StatCard 
          icon={FileText}
          title="Articles"
          value={data.stats.articles.total}
          subtitle={`Latest: ${data.stats.articles.recent}`}
          trend={data.stats.articles.trend}
          color="green"
        />
        <StatCard 
          icon={GraduationCap}
          title="Experience"
          value={data.stats.experience.total}
          subtitle={`Latest: ${data.stats.experience.recent}`}
          trend={data.stats.experience.trend}
          color="purple"
        />
        <StatCard 
          icon={Award}
          title="Certifications"
          value={`${data.stats.certifications.active}/${data.stats.certifications.total}`}
          subtitle={`${data.stats.certifications.expired} expired`}
          trend={data.stats.certifications.trend}
          color="yellow"
        />
        <StatCard 
          icon={Users}
          title="Testimonials"
          value={data.stats.testimonials.total}
          subtitle={`${data.stats.testimonials.pending} pending review`}
          trend={data.stats.testimonials.trend}
          color="pink"
        />
        <StatCard 
          icon={Mail}
          title="Messages"
          value={`${data.stats.messages.unread}/${data.stats.messages.total}`}
          subtitle={`${data.stats.messages.unread} unread messages`}
          trend={data.stats.messages.trend}
          color="red"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Recent Activity</h2>
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`p-1.5 rounded-full ${
                  activity.type === 'project' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  activity.type === 'cert' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                  activity.type === 'article' ? 'bg-green-100 dark:bg-green-900/30' :
                  activity.type === 'testimonial' ? 'bg-pink-100 dark:bg-pink-900/30' :
                  'bg-purple-100 dark:bg-purple-900/30'
                }`}>
                  {activity.type === 'project' && <FolderOpen className="h-3 w-3 text-blue-600 dark:text-blue-400" />}
                  {activity.type === 'cert' && <Award className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />}
                  {activity.type === 'article' && <FileText className="h-3 w-3 text-green-600 dark:text-green-400" />}
                  {activity.type === 'testimonial' && <Users className="h-3 w-3 text-pink-600 dark:text-pink-400" />}
                  {activity.type === 'experience' && <GraduationCap className="h-3 w-3 text-purple-600 dark:text-purple-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Messages Preview */}
        <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Contact Messages</h2>
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </div>
          <div className="space-y-3 mb-4">
            {data.messages.slice(0, 4).map((message) => (
              <div key={message.id} className="p-3 rounded-lg border border-border hover:border-border/80 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground text-sm">{message.name}</h4>
                    {message.status === 'new' && (
                      <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs px-2 py-0.5 rounded-full">New</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{message.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{message.email}</p>
                <p className="text-xs text-muted-foreground font-medium mb-1">{message.subject}</p>
                <p className="text-xs text-muted-foreground/70 truncate">{message.preview}</p>
              </div>
            ))}
          </div>
          <button className="w-full py-2 text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            View All Messages
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <QuickActionButton 
            icon={Plus}
            label="Add Project"
            onClick={() => router.push('/admin/projects/new')}
            color="blue"
          />
          <QuickActionButton 
            icon={Plus}
            label="Add Service"
            onClick={() => router.push('/admin/services/new')}
            color="green"
          />
          <QuickActionButton 
            icon={Plus}
            label="Add Article"
            onClick={() => router.push('/admin/articles/new')}
            color="purple"
          />
          <QuickActionButton 
            icon={Plus}
            label="Add Testimonial"
            onClick={() => router.push('/admin/testimonials/new')}
            color="pink"
          />
          <QuickActionButton 
            icon={Plus}
            label="Add FAQ"
            onClick={() => router.push('/admin/faq/new')}
            color="yellow"
          />
        </div>
      </div>

    </div>
  )
}