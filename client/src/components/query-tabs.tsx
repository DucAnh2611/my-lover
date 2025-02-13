import { EQueryTabType } from "@/enums/question";
import { TTabData } from "@/types/question";
import { EditIcon, TrashIcon } from "lucide-react";
import { useRef, useState } from "react";
import AceEditor from "react-ace";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface IQueryTabProps {
    tabData: TTabData;
    onChange: (tabData: TTabData) => void;
    onRemove: (tabId: string) => void;
    onSelectedCode: (code: string) => void;
}

export default function QueryTab({
    tabData,
    onChange,
    onRemove,
    onSelectedCode,
}: IQueryTabProps) {
    const nameRef = useRef<HTMLInputElement>(null);

    const [isEditing, SetIsEditing] = useState(false);

    const handleRemove = (tabId: string) => () => {
        onRemove(tabId);
    };

    const handleCodeChange = (code: string) => {
        onChange({
            ...tabData,
            query: code,
        });
    };

    const handleCodeSelect = (selection: any) => {
        const selectedText = selection.doc.getTextRange(selection.getRange());

        onSelectedCode(selectedText);
    };

    const handleConfirmEditTabName = () => {
        if (!nameRef.current) return;
        onChange({
            ...tabData,
            title: nameRef.current.value,
        });
    };

    const handleEdit = (edit: boolean) => () => {
        SetIsEditing(edit);
    };

    return (
        <div className="flex flex-col space-y-2">
            <AceEditor
                height="250px"
                width="full"
                placeholder="SQL queries"
                value={tabData.query}
                mode="sql"
                theme="one_dark"
                onChange={(code) => {
                    handleCodeChange(code);
                }}
                onSelectionChange={handleCodeSelect}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    showLineNumbers: true,
                    highlightActiveLine: true,
                    tabSize: 4,
                }}
            />
            {tabData?.type === EQueryTabType.SUPPORTER && (
                <div className="flex gap-3 flex-col md:flex-row">
                    {!isEditing ? (
                        <Button
                            variant={"outline"}
                            onClick={handleEdit(true)}
                            className="flex-1 items-center"
                        >
                            <EditIcon size={15} />
                            Edit tab name
                        </Button>
                    ) : (
                        <div className="flex gap-1 flex-col md:flex-row">
                            <Input
                                ref={nameRef}
                                placeholder="Tab name"
                                defaultValue={tabData.title}
                                className="focus-visible:outline-transparent focus-visible:ring-0"
                            />
                            <Button
                                variant={"outline"}
                                onClick={handleEdit(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleConfirmEditTabName}>
                                Confirm
                            </Button>
                        </div>
                    )}
                    <Button
                        variant={"destructive"}
                        onClick={handleRemove(tabData.id)}
                        className="flex-1 items-center"
                    >
                        <TrashIcon size={15} />
                        Remove Tab
                    </Button>
                </div>
            )}
        </div>
    );
}
