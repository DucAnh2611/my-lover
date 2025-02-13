import useQuestion from "@/hook/useQuestion";
import { DialogTitle } from "@radix-ui/react-dialog";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";

interface IQuestionSubmitResult {
    isOpen: boolean;
    handleOpen: (o: boolean, closeSolvedQuestion?: boolean) => void;
}

export default function QuestionSubmitResult({
    isOpen,
    handleOpen,
}: IQuestionSubmitResult) {
    const { explain, isCorrectSubmit } = useQuestion();
    const [open, SetOpen] = useState<boolean>(isOpen);

    const handleClose = () => {
        handleOpen(false);
    };

    const handleClickCloseQuestion = () => {
        handleOpen(false, true);
    };

    useEffect(() => {
        SetOpen(isOpen);
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={handleOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Submit result</DialogTitle>
                </DialogHeader>
                <div className="w-full py-6">
                    {isCorrectSubmit ? (
                        <div className="text-green-500 flex flex-col gap-3 items-center justify-center">
                            <CheckCircleIcon
                                size={30}
                                className="w-[80px] h-[80px]"
                            />
                            <p>Correct!</p>
                        </div>
                    ) : (
                        <div className="text-destructive flex flex-col gap-3 items-center justify-center">
                            <XCircleIcon
                                size={30}
                                className="w-[80px] h-[80px]"
                            />
                            <p>Incorrect!</p>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <div className="w-full flex gap-2 justify-end">
                        {!isCorrectSubmit ? (
                            <>
                                <Button
                                    onClick={handleClose}
                                    className="w-full"
                                >
                                    Try again
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={handleClickCloseQuestion}
                                    className="w-full"
                                >
                                    Back to question list
                                </Button>
                            </>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
