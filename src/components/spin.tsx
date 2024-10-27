"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    AlertCircle,
    RefreshCw,
    Users,
    Edit2,
    Moon,
    Sun,
    Plus,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTheme } from "next-themes"

export default function RandomTeamGenerator() {
    const [names, setNames] = useState<string[]>([])
    const [numTeams, setNumTeams] = useState(2)
    const [maxPerTeam, setMaxPerTeam] = useState(5)
    const [teams, setTeams] = useState<{ name: string; members: string[] }[]>([
        { name: "Team 1", members: [] },
        { name: "Team 2", members: [] },
    ])
    const [error, setError] = useState("")
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const nameInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const newTeams = Array.from({ length: numTeams }, (_, index) => ({
            name: `Team ${index + 1}`,
            members: [],
        }))
        setTeams(newTeams)
    }, [numTeams])

    const handleAddName = () => {
        if (nameInputRef.current && nameInputRef.current.value.trim() !== "") {
            setNames([...names, nameInputRef.current.value.trim()])
            nameInputRef.current.value = ""
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleAddName()
        }
    }

    const handleRemoveName = (index: number) => {
        setNames(names.filter((_, i) => i !== index))
    }

    const validateInputs = () => {
        if (names.length < numTeams) {
            setError(
                "Not enough names to generate teams. Add more names or reduce the number of teams."
            )
            return false
        }
        if (maxPerTeam < 1) {
            setError("Max participants per team must be at least 1.")
            return false
        }
        if (maxPerTeam * numTeams < names.length) {
            setError(
                "The total capacity of all teams is less than the number of participants. Increase max participants per team or add more teams."
            )
            return false
        }
        setError("")
        return true
    }

    const generateTeams = () => {
        if (!validateInputs()) return

        const shuffled = [...names].sort(() => 0.5 - Math.random())
        const newTeams: { name: string; members: string[] }[] = teams.map(
            (team) => ({
                ...team,
                members: [] as string[],
            })
        )

        let teamIndex = 0

        shuffled.forEach((name) => {
            if (newTeams[teamIndex].members.length < maxPerTeam) {
                newTeams[teamIndex].members.push(name)
            } else {
                teamIndex = (teamIndex + 1) % numTeams
                newTeams[teamIndex].members.push(name)
            }
        })

        setTeams(newTeams)
    }

    const resetAll = () => {
        setNames([])
        setNumTeams(2)
        setMaxPerTeam(5)
        setTeams([
            { name: "Team 1", members: [] },
            { name: "Team 2", members: [] },
        ])
        setError("")
    }

    const handleTeamNameChange = (index: number, newName: string) => {
        setTeams((prevTeams) => {
            const newTeams = [...prevTeams]
            newTeams[index] = { ...newTeams[index], name: newName }
            return newTeams
        })
    }

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    if (!mounted) {
        return null
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl min-h-screen flex flex-col">
            <header className="flex justify-between items-center mb-8">
                <div className="flex flex-col">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mt-3">
                        TeamSpinner
                    </h1>
                    <div className="flex flex-col">
                        <p className="text-sm text-gray-600 dark:text-gray-300 ms-1">
                            Created with ♡ by:{" "}
                            <a
                                href="https://handikatriarlan.my.id"
                                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline ms-1"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                handikatriarlan
                            </a>
                        </p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="rounded-full"
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </header>
            <Card className="mb-8">
                <CardContent className="p-6">
                    <div className="grid gap-6">
                        <div>
                            <Label
                                htmlFor="names"
                                className="text-lg font-semibold mb-2 block"
                            >
                                Enter Name
                            </Label>
                            <div className="flex">
                                <Input
                                    id="names"
                                    ref={nameInputRef}
                                    placeholder="Type a name"
                                    onKeyPress={handleKeyPress}
                                    className="text-lg flex-grow"
                                />
                                <Button
                                    onClick={handleAddName}
                                    className="ml-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span className="sr-only">Add name</span>
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <AnimatePresence>
                                {names.map((name, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center shadow-md"
                                    >
                                        {name}
                                        <button
                                            onClick={() =>
                                                handleRemoveName(index)
                                            }
                                            className="ml-2 text-primary-foreground hover:text-red-500 focus:outline-none"
                                        >
                                            ×
                                        </button>
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <Label
                                    htmlFor="numTeams"
                                    className="text-lg font-semibold mb-2 block"
                                >
                                    Number of Teams
                                </Label>
                                <Input
                                    id="numTeams"
                                    type="number"
                                    min="2"
                                    value={numTeams}
                                    onChange={(e) =>
                                        setNumTeams(
                                            Math.max(
                                                2,
                                                parseInt(e.target.value)
                                            )
                                        )
                                    }
                                    className="text-lg"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="maxPerTeam"
                                    className="text-lg font-semibold mb-2 block"
                                >
                                    Max Participants per Team
                                </Label>
                                <Input
                                    id="maxPerTeam"
                                    type="number"
                                    min="1"
                                    value={maxPerTeam}
                                    onChange={(e) =>
                                        setMaxPerTeam(
                                            Math.max(
                                                1,
                                                parseInt(e.target.value)
                                            )
                                        )
                                    }
                                    className="text-lg"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button
                                onClick={generateTeams}
                                size="lg"
                                className="text-lg w-full sm:w-auto"
                            >
                                <Users className="mr-2 h-5 w-5" /> Generate
                                Teams
                            </Button>
                            <Button
                                variant="outline"
                                onClick={resetAll}
                                size="lg"
                                className="text-lg w-full sm:w-auto"
                            >
                                <RefreshCw className="mr-2 h-5 w-5" /> Reset
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {teams.map((team, index) => (
                        <Card key={index} className="overflow-hidden">
                            <CardHeader className="bg-primary text-primary-foreground p-4 flex flex-row items-center justify-between">
                                <Input
                                    value={team.name}
                                    onChange={(e) =>
                                        handleTeamNameChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                    className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 h-auto"
                                />
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-primary-foreground hover:text-primary-foreground/80"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Edit team name</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </CardHeader>
                            <CardContent className="p-4">
                                <ul className="list-disc list-inside space-y-1">
                                    {team.members.map((member, memberIndex) => (
                                        <motion.li
                                            key={memberIndex}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: memberIndex * 0.1,
                                            }}
                                            className="text-lg"
                                        >
                                            {member}
                                        </motion.li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
