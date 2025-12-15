"use client"

import { useEffect, useState } from "react"
import { Search, Plus, X, Check } from "lucide-react"
import { DynamicSiIcon } from "@/components/ui/dynamicsiicon"
import { loadSiIcons } from "@/lib/si-icon-cache"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"

interface Tool {
    id: string
    name: string
    key: string
    color: string
}

export default function Page() {
    const [tools, setTools] = useState<Tool[]>([])
    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState<Tool | null>(null)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        name: "",
        key: "",
        color: "#3b82f6",
    })

    const [icons, setIcons] = useState<string[]>([])
    const [iconSearch, setIconSearch] = useState("")
    const [showIconPicker, setShowIconPicker] = useState(false)

    /* ================= FETCH ================= */
    async function fetchTools() {
        try {
            setLoading(true)
            const res = await fetch("/api/techstacks/all")
            if (!res.ok) throw new Error("Failed to fetch tools")

            const json = await res.json()
            setTools(json.data || [])
        } catch (err) {
            console.error(err)
            toast.error("Failed to load tools")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTools()
        loadSiIcons()
            .then((icons) => {
                setIcons(
                    Object.keys(icons)
                        .filter((k) => k.startsWith("Si"))
                        .sort()
                )
            })
            .catch(() => {
                toast.error("Failed to load icons")
            })
    }, [])

    /* ================= OPEN ================= */
    function openCreate() {
        setEditing(null)
        setForm({ name: "", key: "", color: "#3b82f6" })
        setIconSearch("")
        setShowIconPicker(false)
        setOpen(true)
    }

    function openEdit(tool: Tool) {
        setEditing(tool)
        setForm(tool)
        setIconSearch("")
        setShowIconPicker(false)
        setOpen(true)
    }

    /* ================= SUBMIT ================= */
    async function submit() {
        if (!form.name || !form.key) return

        try {
            setLoading(true)

            const url = editing
                ? `/api/techstacks/all/${editing.id}`
                : "/api/techstacks/all"

            const res = await fetch(url, {
                method: editing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            if (!res.ok) {
                const msg = editing
                    ? "Failed to update tool"
                    : "Failed to create tool"
                throw new Error(msg)
            }

            toast.success(
                editing ? "Tool updated successfully" : "Tool created successfully"
            )

            setOpen(false)
            fetchTools()
        } catch (err) {
            console.error(err)
            toast.error(
                err instanceof Error ? err.message : "Something went wrong"
            )
        } finally {
            setLoading(false)
        }
    }

    /* ================= DELETE ================= */
    async function deleteTool() {
        if (!editing) return

        try {
            setLoading(true)

            const res = await fetch(
                `/api/techstacks/all/${editing.id}`,
                { method: "DELETE" }
            )

            if (!res.ok) throw new Error("Failed to delete tool")

            toast.success("Tool deleted successfully")
            setOpen(false)
            fetchTools()
        } catch (err) {
            console.error(err)
            toast.error("Failed to delete tool")
        } finally {
            setLoading(false)
        }
    }

    const filteredIcons = icons.filter((i) =>
        i.toLowerCase().includes(iconSearch.toLowerCase())
    )

    return (
        <div className="min-h-screen p-6 space-y-6">
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
                    <div className="rounded-md bg-card px-4 py-2 shadow">
                        Loading...
                    </div>
                </div>
            )}
            {/* Header */}
            <div className="flex items-center justify-between bg-card border rounded-xl p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Tools & Tech
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your tools and technologies
                    </p>
                </div>
                <Button onClick={openCreate} className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Tool
                </Button>
            </div>

            {/* Content */}
            <div className="mx-auto py-8">
                {tools.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                        No tools yet
                    </p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {tools.map((tool) => (
                            <Button
                                key={tool.id}
                                variant="outline"
                                onClick={() => openEdit(tool)}
                                className="h-auto p-6"
                            >
                                <div className="flex flex-col items-center gap-4">
                                    <DynamicSiIcon
                                        name={tool.key}
                                        size={56}
                                        color={tool.color}
                                    />
                                    <p className="font-semibold truncate">
                                        {tool.name}
                                    </p>
                                </div>
                            </Button>
                        ))}
                    </div>
                )}
            </div>

            {/* ================= DIALOG ================= */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? "Edit Tool" : "Add New Tool"}
                        </DialogTitle>

                        <DialogClose asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-4"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </DialogClose>
                    </DialogHeader>

                    {/* Body */}
                    <div className="space-y-4">
                        <input
                            placeholder="Tool name"
                            className="w-full border px-3 py-2 rounded-lg"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />

                        {/* Icon Picker */}
                        <div className="relative">
                            <Button
                                variant="outline"
                                className="w-full justify-between"
                                onClick={() =>
                                    setShowIconPicker(!showIconPicker)
                                }
                            >
                                {form.key || "Select icon"}
                                <Search className="w-4 h-4" />
                            </Button>

                            {showIconPicker && (
                                <div className="absolute z-50 mt-2 w-full bg-card border rounded-xl">
                                    <input
                                        placeholder="Search..."
                                        className="w-full px-3 py-2 border-b"
                                        value={iconSearch}
                                        onChange={(e) =>
                                            setIconSearch(e.target.value)
                                        }
                                    />
                                    <div className="grid grid-cols-6 gap-1 p-2 max-h-60 overflow-y-auto">
                                        {filteredIcons.map((name) => (
                                            <Button
                                                key={name}
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => {
                                                    setForm({
                                                        ...form,
                                                        key: name,
                                                    })
                                                    setShowIconPicker(false)
                                                }}
                                            >
                                                <DynamicSiIcon
                                                    name={name}
                                                    size={22}
                                                    color={form.color}
                                                />
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <input
                            type="color"
                            value={form.color}
                            onChange={(e) =>
                                setForm({ ...form, color: e.target.value })
                            }
                        />
                    </div>

                    <DialogFooter>
                        {editing && (
                            <Button
                                variant="destructive"
                                onClick={deleteTool}
                                disabled={loading}
                            >
                                Delete
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={submit}
                            disabled={loading || !form.name || !form.key}
                        >
                            <Check className="w-4 h-4 mr-2" />
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
