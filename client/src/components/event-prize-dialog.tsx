import { EEventView } from "@/enums/event";
import useEvent from "@/hook/useEvent";
import useEventPrize from "@/hook/useEventPrize";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";

export default function EventPrizeDialog() {
    const { open, handleOpen: handleOpenDialog, prize } = useEventPrize();

    const { event, setStatus } = useEvent();

    useEffect(() => {
        if (open) {
            setStatus(EEventView.PREVIEW);
        }
    }, [open]);

    if (!event) return <></>;

    return (
        <Dialog open={open} onOpenChange={handleOpenDialog}>
            <DialogContent className="max-md:px-3 max-md:flex max-md:flex-col">
                <DialogHeader>
                    <DialogTitle>Prize of {event.name}</DialogTitle>
                    <DialogDescription>
                        You good, you deserve it!
                    </DialogDescription>
                </DialogHeader>

                <div className="w-full h-fit overflow-hidden max-md:flex-1 flex flex-col">
                    <div className="w-full h-fit max-h-[700px] overflow-hidden overflow-y-auto">
                        <Editor
                            tinymceScriptSrc="/tinymce/tinymce.min.js"
                            value={prize || ""}
                            init={{
                                height: 500,
                                menubar: false,
                                statusbar: false,
                                plugins: [],
                                toolbar: [],
                                skin: "oxide-dark",
                                content_css: "dark",
                                editable_root: false,
                            }}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
