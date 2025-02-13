const { In } = require("typeorm");
const { QUESTION_CODE_CONSTANT } = require("../../constant/question");
const ResponseFormat = require("../../helper/response");
const EventRepository = require("../../repository/event");
const EventCodeRepository = require("../../repository/event-code");
const QuestionRepository = require("../../repository/question");
const QuestionCodeRepository = require("../../repository/question-code");
const QuestionCodeEntity = require("../../entity/question-code");

const EventClientService = {
    list: async (codeId) => {
        const [[events, count], entried] = await Promise.all([
            EventRepository.findAndCount(),
            EventCodeRepository.find({
                where: { codeId: codeId },
            }),
        ]);

        const mapEntried = events.map((event) => {
            const res = {
                ...event,
                isEntry: false,
                eventCode: null,
            };

            const findEntry = entried.find(
                (entry) => entry.eventId === event.id
            );

            if (findEntry) {
                res.eventCode = findEntry;
                res.isEntry = true;
            }

            return res;
        });

        return ResponseFormat.ok({
            items: mapEntried,
            count,
        });
    },
    detail: async (codeId, eventId) => {
        const isExistEvent = await EventRepository.findOne({
            where: { id: eventId },
            select: {
                id: true,
                description: true,
                end: true,
                name: true,
                start: true,
                prize: false,
            },
        });

        if (!isExistEvent) {
            return ResponseFormat.error(404, "Sự kiện không tồn tại!");
        }

        try {
            const [isEntried, quesCount, quesPass] = await Promise.all([
                EventCodeRepository.findOne({
                    where: {
                        codeId,
                        eventId,
                    },
                }),
                QuestionRepository.count({
                    where: { eventId },
                }),
                QuestionCodeRepository.count({
                    where: {
                        codeId,
                        status: QUESTION_CODE_CONSTANT.status.PASS,
                        question: {
                            eventId,
                        },
                    },
                }),
            ]);

            return ResponseFormat.ok({
                ...isExistEvent,
                data: isEntried?.data,
                quesCount: quesCount,
                quesPassCount: quesPass,
                canTakePrize: quesPass === quesCount && !!quesCount,
            });
        } catch (error) {
            console.log(error);
            return ResponseFormat.internal;
        }
    },
    entry: async (codeId, eventId) => {
        const isExistEvent = await EventRepository.findOne({
            where: { id: eventId },
        });

        if (!isExistEvent) {
            return ResponseFormat.error(404, "Sự kiện không tồn tại!");
        }

        try {
            const isEntried = await EventCodeRepository.findOne({
                where: {
                    codeId,
                    eventId,
                },
            });

            if (!isEntried) {
                const instance = EventCodeRepository.create({
                    codeId,
                    eventId,
                });

                await EventCodeRepository.save(instance);
            }

            return ResponseFormat.ok();
        } catch (error) {
            return ResponseFormat.internal;
        }
    },
    takePrize: async (codeId, eventId) => {
        const isExistEvent = await EventRepository.findOne({
            where: { id: eventId },
        });

        if (!isExistEvent) {
            return ResponseFormat.error(404, "Sự kiện không tồn tại!");
        }

        try {
            const [questionEvents, questionPass] = await Promise.all([
                QuestionRepository.find({
                    where: {
                        eventId: eventId,
                    },
                }),
                QuestionCodeRepository.count({
                    where: {
                        codeId,
                        status: QUESTION_CODE_CONSTANT.status.PASS,
                        question: {
                            eventId,
                        },
                    },
                }),
            ]);

            if (
                questionPass !== questionEvents.length &&
                !!questionEvents.length
            ) {
                return ResponseFormat.error(
                    400,
                    "All questions must be solved!"
                );
            }

            return ResponseFormat.ok({
                prize: isExistEvent.prize,
            });
        } catch (error) {
            return ResponseFormat.internal;
        }
    },
};

module.exports = EventClientService;
