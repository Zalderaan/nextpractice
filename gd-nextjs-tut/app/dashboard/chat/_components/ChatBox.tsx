"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUp, Paperclip, Sparkles } from "lucide-react"

export function ChatBox() {
    const [input, setInput] = useState("")

    const handleSend = () => {
        const trimmed = input.trim()
        if (!trimmed) return

        console.log("Sending prompt:", trimmed)
        setInput("")
    }

    const canSend = input.trim().length > 0

    return (
        <div className="w-full max-w-3xl px-4">
            <div className="rounded-3xl border border-border/70 bg-background/95 p-3 shadow-xl backdrop-blur">
                <div className="rounded-2xl border border-border/60 bg-muted/30 p-3">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Message BLAG..."
                        className="min-h-28 resize-none border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleSend()
                            }
                        }}
                    />

                    <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Button type="button" variant="ghost" size="sm" className="rounded-full">
                                <Paperclip className="size-4" />
                                Attach
                            </Button>

                            <Button type="button" variant="ghost" size="sm" className="rounded-full">
                                <Sparkles className="size-4" />
                                Improve prompt
                            </Button>
                        </div>

                        <Button
                            type="button"
                            onClick={handleSend}
                            disabled={!canSend}
                            className="size-9 rounded-full p-0"
                            aria-label="Send message"
                        >
                            <ArrowUp className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}