'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea' // Assuming you have this; if not, install/add it

const Tiptap = () => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>Hello World! 🌎️</p>', // Editable content
        immediatelyRender: false,
    })

    // Early return if editor isn't ready
    if (!editor) {
        return null
    }

    return (
        <main className="flex flex-col items-center justify-start min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
            <Card className="w-full max-w-4xl shadow-lg">
                {/* <CardHeader>
                    <CardTitle className="text-center text-2xl">Create Your Post</CardTitle>
                </CardHeader> */}
                <CardContent className="space-y-6">
                    {/* Title and Subtitle Section */}
                    <Card className="border-dashed text-left">
                        <CardContent>
                            <Input
                                placeholder="Title"
                                className="border-0 text-4xl! h-16 py-4 font-bold"
                            />
                            <Input
                                placeholder="Subtitle here"
                                className="border-0 text-xl!"
                            />
                            <Input
                                placeholder="Cover Image URL or File"
                                type="file"
                                className="border-0"
                            />
                        </CardContent>
                    </Card>

                    {/* {/* Additional Metadata Section */}
                    {/* <Card className="border-dashed">
                        <CardHeader>
                            <CardTitle className="text-lg">Post Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input placeholder="Author Name" />
                            <Input placeholder="Publish Date" type="date" />
                            <Textarea
                                placeholder="Tags (comma-separated, e.g., tech, react)"
                                className="md:col-span-2"
                                rows={2}
                            />
                        </CardContent>
                    </Card> */}

                    {/* Toolbar */}
                    <div className="flex gap-2 flex-wrap justify-center">
                        <Button
                            variant={editor.isActive('bold') ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                        >
                            Bold
                        </Button>
                        <Button
                            variant={editor.isActive('italic') ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                        >
                            Italic
                        </Button>
                        <Button
                            variant={editor.isActive('bulletList') ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                        >
                            Bullet List
                        </Button>
                        <Button
                            variant={editor.isActive('orderedList') ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        >
                            Ordered List
                        </Button>
                    </div>

                    {/* Editor Section */}
                    <Card className="border-dashed">
                        <CardContent className="pt-6">
                            <EditorContent
                                editor={editor}
                                className="min-h-75 h-full prose prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none"
                            />
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-center">
                        <Button size="lg" className="w-full md:w-auto">
                            Save Draft
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}

export default Tiptap