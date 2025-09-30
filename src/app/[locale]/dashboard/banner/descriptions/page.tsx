'use client'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, Plus, Trash2, Eye, Download, Code2, Cpu, Zap, Globe, FileText } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Page(){
    // State for typewriter texts
    const [typewriterTexts, setTypewriterTexts] = useState([
        "Fullstack Web Developer",
        "Frontend & Backend Engineer", 
        "AWS Cloud Computing Trainer",
        "AI & Emerging Tech Enthusiast",
        "High School Student"
    ]);
    const [newTypewriterText, setNewTypewriterText] = useState("");

    // State for description parts
    const [description, setDescription] = useState({
        greeting: "Hi! I'm a",
        part1: "Passionate about creating",
        highlight1: "impactful digital experiences",
        part2: ". Skilled in building",
        highlight2: "scalable systems",
        part3: "and",
        highlight3: "user-centered interfaces",
        part4: "with a strong focus on",
        highlight4: "performance",
        part5: "and",
        highlight6: "long-term maintainability",
        part7: "."
    });

    // State for tech icons
    const [techIcons] = useState([
        { icon: "Code2", label: "Full Stack" },
        { icon: "Cpu", label: "AI/ML" },
        { icon: "Zap", label: "Performance" },
        { icon: "Globe", label: "Cloud" }
    ]);

    // State for buttons
    // const [buttons] = useState({
    //     viewProjects: "View Projects",
    //     downloadCV: "Download CV"
    // });

    // State for code elements
    // const [codeElements] = useState({
    //     developer: "<developer/>",
    //     console: "Hello!"
    // });

    // State for scroll indicator
    // const [scrollIndicator] = useState("SCROLL");

    // State for image
    const [imageAlt, setImageAlt] = useState("Habibi Ahmad Aziz - Fullstack Developer");

    // Functions for typewriter management
    const addTypewriterText = () => {
        if (newTypewriterText.trim()) {
            setTypewriterTexts([...typewriterTexts, newTypewriterText.trim()]);
            setNewTypewriterText("");
        }
    };

    const removeTypewriterText = (index: number) => {
        setTypewriterTexts(typewriterTexts.filter((_, i) => i !== index));
    };

    const updateTypewriterText = (index: number, value: string) => {
        const updated = [...typewriterTexts];
        updated[index] = value;
        setTypewriterTexts(updated);
    };

    // Functions for tech icons management
    // const updateTechIconLabel = (index: number, label: string) => {
    //     const updated = [...techIcons];
    //     updated[index].label = label;
    //     setTechIcons(updated);
    // };

    return(
        <>
            <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Hero Section Management</h2>
                <p className="text-muted-foreground text-sm sm:text-base">Customize your hero section content typewriter texts, descriptions</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Main Form Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Typewriter Texts */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Code2 className="w-5 h-5" />
                                Typewriter Texts
                            </CardTitle>
                            <CardDescription>
                                Manage the rotating text that appears in the hero section
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {typewriterTexts.map((text, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Badge variant="outline" className="min-w-[2rem] text-center">
                                            {index + 1}
                                        </Badge>
                                        <Input
                                            value={text}
                                            onChange={(e) => updateTypewriterText(index, e.target.value)}
                                            placeholder="Enter typewriter text"
                                            className="flex-1"
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeTypewriterText(index)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={newTypewriterText}
                                    onChange={(e) => setNewTypewriterText(e.target.value)}
                                    placeholder="Add new typewriter text"
                                    className="flex-1"
                                    onKeyPress={(e) => e.key === 'Enter' && addTypewriterText()}
                                />
                                <Button onClick={addTypewriterText} size="icon">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Description Text</CardTitle>
                            <CardDescription>
                                Manage the main description text with highlighted parts
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="greeting">Greeting</Label>
                                    <Input
                                        id="greeting"
                                        value={description.greeting}
                                        onChange={(e) => setDescription({...description, greeting: e.target.value})}
                                        placeholder="e.g., Hi! I'm a"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor="part1">Part 1</Label>
                                        <Input
                                            id="part1"
                                            value={description.part1}
                                            onChange={(e) => setDescription({...description, part1: e.target.value})}
                                            placeholder="e.g., Passionate about creating"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="highlight1">Highlight 1</Label>
                                        <Input
                                            id="highlight1"
                                            value={description.highlight1}
                                            onChange={(e) => setDescription({...description, highlight1: e.target.value})}
                                            placeholder="e.g., impactful digital experiences"
                                            className="border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor="part2">Part 2</Label>
                                        <Input
                                            id="part2"
                                            value={description.part2}
                                            onChange={(e) => setDescription({...description, part2: e.target.value})}
                                            placeholder="e.g., . Skilled in building"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="highlight2">Highlight 2</Label>
                                        <Input
                                            id="highlight2"
                                            value={description.highlight2}
                                            onChange={(e) => setDescription({...description, highlight2: e.target.value})}
                                            placeholder="e.g., scalable systems"
                                            className="border-cyan-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor="part3">Part 3</Label>
                                        <Input
                                            id="part3"
                                            value={description.part3}
                                            onChange={(e) => setDescription({...description, part3: e.target.value})}
                                            placeholder="e.g., and"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="highlight3">Highlight 3</Label>
                                        <Input
                                            id="highlight3"
                                            value={description.highlight3}
                                            onChange={(e) => setDescription({...description, highlight3: e.target.value})}
                                            placeholder="e.g., user-centered interfaces"
                                            className="border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor="part4">Part 4</Label>
                                        <Input
                                            id="part4"
                                            value={description.part4}
                                            onChange={(e) => setDescription({...description, part4: e.target.value})}
                                            placeholder="e.g., with a strong focus on"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="highlight4">Highlight 4</Label>
                                        <Input
                                            id="highlight4"
                                            value={description.highlight4}
                                            onChange={(e) => setDescription({...description, highlight4: e.target.value})}
                                            placeholder="e.g., performance"
                                            className="border-cyan-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor="part5">Part 5</Label>
                                        <Input
                                            id="part5"
                                            value={description.part5}
                                            onChange={(e) => setDescription({...description, part5: e.target.value})}
                                            placeholder="e.g., and"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="highlight6">Highlight 6</Label>
                                        <Input
                                            id="highlight6"
                                            value={description.highlight6}
                                            onChange={(e) => setDescription({...description, highlight6: e.target.value})}
                                            placeholder="e.g., long-term maintainability"
                                            className="border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="part7">Part 7 (End)</Label>
                                    <Input
                                        id="part7"
                                        value={description.part7}
                                        onChange={(e) => setDescription({...description, part7: e.target.value})}
                                        placeholder="e.g., ."
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Image Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Image Settings</CardTitle>
                            <CardDescription>
                                Manage the hero section image and alt text
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="imageAlt">Image Alt Text</Label>
                                <Input
                                    id="imageAlt"
                                    value={imageAlt}
                                    onChange={(e) => setImageAlt(e.target.value)}
                                    placeholder="Alt text for the hero image"
                                />
                            </div>
                            <div className="relative">
                                <Input
                                    id="imageUpload"
                                    type="file"
                                    accept=".png,.jpg,.jpeg,.webp"
                                    className={`
                                        file:border-0 file:rounded-md
                                        file:px-4 file:mr-4
                                        cursor-pointer
                                        file:cursor-pointer
                                        h-auto
                                    `}
                                />
                                <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* CV Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle>CV Management</CardTitle>
                            <CardDescription>
                                Upload and manage your CV file for download
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-8 h-8 text-blue-500" />
                                    <div>
                                        <p className="font-medium">Current CV</p>
                                        <p className="text-sm text-muted-foreground">cv.pdf (2.1 MB)</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Preview
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-destructive">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="relative">
                                <Input
                                    id="cvUpload"
                                    type="file"
                                    accept=".pdf"
                                    className={`
                                        file:border-0 file:rounded-md
                                        file:px-4 file:mr-4
                                        cursor-pointer
                                        file:cursor-pointer
                                        h-auto
                                    `}
                                />
                                <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview Section */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                Live Preview
                            </CardTitle>
                            <CardDescription>
                                See how your changes will look
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-4">Typewriter Texts:</h4>
                                    <div className="space-y-1">
                                        {typewriterTexts.map((text, index) => (
                                            <Badge key={index} variant="secondary" className="mr-1">
                                                {text}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-4">Description Preview:</h4>
                                    <p className="text-sm leading-relaxed">
                                        <span className="text-blue-600">{description.greeting}</span>{" "}
                                        <span className="font-semibold text-blue-600">{description.highlight1}</span>{" "}
                                        <span>{description.part1}</span>{" "}
                                        <span className="font-semibold text-cyan-600">{description.highlight2}</span>{" "}
                                        <span>{description.part2}</span>{" "}
                                        <span className="font-semibold text-blue-600">{description.highlight3}</span>{" "}
                                        <span>{description.part3}</span>{" "}
                                        <span className="font-semibold text-cyan-600">{description.highlight4}</span>{" "}
                                        <span>{description.part4}</span>{" "}
                                        <span className="font-semibold text-blue-600">{description.highlight6}</span>{" "}
                                        <span>{description.part5}</span>
                                        <span>{description.part7}</span>
                                    </p>
                                </div>
                                
                                <Separator />
                                
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-4">Tech Icons:</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {techIcons.map((tech, index) => (
                                            <div key={index} className="flex items-center gap-2 text-xs">
                                                {tech.icon === "Code2" && <Code2 className="w-3 h-3" />}
                                                {tech.icon === "Cpu" && <Cpu className="w-3 h-3" />}
                                                {tech.icon === "Zap" && <Zap className="w-3 h-3" />}
                                                {tech.icon === "Globe" && <Globe className="w-3 h-3" />}
                                                <span>{tech.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator/>

                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-4">Self Image</h4>
                                    
                                    <Image src={"/self-photo-habibi-ahmad-aziz.webp"} alt="Habibi Ahmad Aziz" width={50} height={100}/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button className="w-full" variant="default">
                                Save Changes
                            </Button>
                            <Button className="w-full" variant="outline">
                                Reset to Default
                            </Button>
                            <Button className="w-full" variant="outline">
                                Preview Full Page
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}
