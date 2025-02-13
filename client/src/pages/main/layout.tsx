import EventDetailCard from "@/components/event-detail-card";
import EventPrizeDialog from "@/components/event-prize-dialog";
import EventQuestionDialog from "@/components/event-question-dialog";
import EventStatusBox from "@/components/event-status";
import Navigation from "@/components/nav";
import BlurFade from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { Card } from "@/components/ui/card";
import GridPattern from "@/components/ui/grid-pattern";
import { Separator } from "@/components/ui/separator";
import ShineBorder from "@/components/ui/shine-border";
import EventPrizeProvider from "@/context/event-prize.context";
import useEvent from "@/hook/useEvent";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom";

export default function LayoutMain() {
    const { event, status } = useEvent();

    return (
        <div className="w-full h-[100dvh] box-border 2xl:py-10 xl:py-5 xl:px-0 py-2 px-2 relative">
            <EventPrizeProvider>
                <div className="flex gap-5 relative w-fit z-[1] md:mx-auto max-md:w-full flex-col-reverse xl:flex-row">
                    <Card className="lg:!w-[500px] !w-full h-full box-border p-5 shadow-2xl shadow-muted relative">
                        <div className="w-full flex flex-col gap-3 h-full">
                            <div className="w-full overflow-hidden">
                                <Navigation />
                            </div>
                            <Separator orientation="horizontal" />
                            <div className="flex-1 w-full overflow-y-auto">
                                <Outlet />
                            </div>
                        </div>
                        <BorderBeam size={300} duration={10} delay={9} />
                    </Card>

                    {!!event && (
                        <div className="md:w-fit h-full box-border w-full">
                            <BlurFade inView>
                                <div className="flex flex-col gap-2 justify-start items-end">
                                    <ShineBorder
                                        className="shadow-xl shadow-muted min-w-0 min-h-0 box-border p-1 max-md:w-full"
                                        color={[
                                            "#A07CFE",
                                            "#FE8FB5",
                                            "#FFBE7B",
                                        ]}
                                    >
                                        <EventStatusBox
                                            event={event}
                                            status={status}
                                        />
                                    </ShineBorder>
                                    <div className="lg:w-[500px] w-full ">
                                        <EventDetailCard event={event} />
                                    </div>
                                </div>
                            </BlurFade>
                            <EventQuestionDialog />
                        </div>
                    )}
                </div>
                <EventPrizeDialog />
            </EventPrizeProvider>
            <GridPattern
                width={30}
                height={30}
                x={-1}
                y={-1}
                strokeDasharray={"4 2"}
                className={cn(
                    "[mask-image:radial-gradient(50dvw_circle_at_center,white,transparent)] z-0"
                )}
            />
        </div>
    );
}
