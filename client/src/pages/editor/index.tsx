import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Editor } from "@tinymce/tinymce-react";
import { CopyIcon } from "lucide-react";
import { useRef, useState } from "react";

export default function EditorPage() {
    const editorRef = useRef<any>(null);

    const [html, SetHtml] = useState<string>("");

    const copy = () => {
        if (editorRef.current) {
            navigator.clipboard.writeText(JSON.stringify(html));
            if (!html) {
                toast({
                    title: "Failed!",
                    description: "No content to copy!",
                    variant: "destructive",
                });
                return;
            }
            toast({
                title: "Copied!",
                description: "Copied content to clipboard!",
            });
        }
    };

    document.title = "Editor";

    return (
        <div className="w-full h-[100dvh] flex items-center justify-center">
            <Card className="p-3 flex flex-col gap-2">
                <Button size={"icon"} onClick={copy}>
                    <CopyIcon size={15} />
                </Button>
                <Editor
                    tinymceScriptSrc="/tinymce/tinymce.min.js"
                    onInit={(_evt: any, editor: any) => {
                        editorRef.current = editor;
                    }}
                    onEditorChange={(a, e) => {
                        SetHtml(e.getContent() || "");
                    }}
                    value={html}
                    init={{
                        height: 500,
                        menubar: true,
                        plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "preview",
                            "help",
                            "wordcount",
                        ],
                        skin: "oxide-dark",
                        content_css: "dark",
                        toolbar:
                            "undo redo | blocks fontfamily fontsize | " +
                            "bold italic forecolor | alignleft aligncenter | " +
                            "alignright alignjustify | bullist numlist outdent indent | " +
                            "removeformat | help",
                        content_style:
                            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                        font_size_formats:
                            "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",
                    }}
                />
            </Card>
        </div>
    );
}
