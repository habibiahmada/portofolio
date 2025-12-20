import DashboardHeader from "@/components/ui/sections/admin/dashboardheader";

export default function Page() {
    return (
        <>
            <div className="min-h-screen p-6 space-y-6">
                <DashboardHeader
                    title="Contacts"
                    description="Manage your contacts"
                />
            </div>
        </>
    )
}