const { In, QueryFailedError } = require("typeorm");
const ResponseFormat = require("../../helper/response");
const QuestionRepository = require("../../repository/question");
const QuestionCodeRepository = require("../../repository/question-code");
const {
    QUESTION_CODE_CONSTANT,
    QUESTION_HISTORY_CONSTANT,
} = require("../../constant/question");
const { AppClientDataSource } = require("../../lib/database");
const { compareArraysByAttributes } = require("../../helper/array");
const QuestionAdminService = require("./admin.service");
const QuestionHistoryRepository = require("../../repository/question-history");
const QuestionRequirementRepository = require("../../repository/question-requirement");
const EventRepository = require("../../repository/event");
const EventCodeRepository = require("../../repository/event-code");

const QuestionClientService = {
    tree: async (codeId, eventId) => {
        const [items, count] = await QuestionRepository.findAndCount({
            where: {
                eventId: eventId,
            },
            select: {
                id: true,
                title: true,
                description: true,
                no: true,
                retriable: true,
                eventId: true,
                content: true,
                answere: false,
                explain: false,
                preRun: false,
            },
            order: {
                no: "ASC",
            },
        });

        if (count === 0)
            return ResponseFormat.ok({
                items,
                count,
            });

        const [codeQuestion, questionRequirement, eventEntried] =
            await Promise.all([
                QuestionCodeRepository.find({
                    where: {
                        codeId,
                    },
                    relations: {
                        questionHistory: true,
                    },
                }),
                QuestionRequirementRepository.find({
                    where: {
                        targetId: In(items.map((i) => i.id)),
                    },
                    relations: {
                        requirement: {
                            event: true,
                        },
                    },
                    select: {
                        requirement: {
                            id: true,
                            title: true,
                            description: true,
                            no: true,
                            retriable: true,
                            eventId: true,
                            content: true,
                            answere: false,
                            explain: false,
                            preRun: false,
                            event: {
                                id: true,
                                name: true,
                                description: true,
                                start: true,
                                end: true,
                                prize: false,
                            },
                        },
                    },
                }),
                EventCodeRepository.find({
                    where: {
                        codeId: codeId,
                    },
                }),
            ]);

        const mapCodeData = items.map((item) => {
            const questionCode = codeQuestion.find(
                (i) => i.questionId === item.id
            );

            return {
                ...item,
                status:
                    questionCode?.status ||
                    QUESTION_CODE_CONSTANT.status.LOCKED,
                ...(questionCode
                    ? {
                          questionCode,
                      }
                    : {}),
            };
        });

        const mapRequirement = mapCodeData.map((question) => {
            const questionRequirements = questionRequirement.filter(
                (i) => i.targetId === question.id
            );
            const mapRequirementStatus = questionRequirements.map((qr) => {
                const requirementStatus = codeQuestion.find(
                    (i) => i.questionId === qr.requirementId
                );

                const isEntriedEvent = eventEntried.find(
                    (i) => i.id === qr.requirement.eventId
                );

                return {
                    ...qr,
                    requirement: {
                        ...qr.requirement,
                        status: requirementStatus
                            ? codeQuestion.find(
                                  (i) =>
                                      i.questionId ===
                                      requirementStatus.questionId
                              )?.status
                            : QUESTION_CODE_CONSTANT.status.LOCKED,
                        event: {
                            ...qr.requirement.event,
                            isEntry: !!isEntriedEvent,
                        },
                    },
                };
            });

            let canStart =
                mapRequirementStatus.filter(
                    (r) =>
                        r.requirement.status ===
                        QUESTION_CODE_CONSTANT.status.PASS
                ).length === mapRequirementStatus.length;

            if (
                canStart &&
                question.questionCode?.status ===
                    QUESTION_CODE_CONSTANT.status.PASS &&
                !question.retriable
            ) {
                canStart = false;
            }

            return {
                ...question,
                canStart,
                requirement: mapRequirementStatus.map((r) => r.requirement),
            };
        });

        return ResponseFormat.ok({
            items: mapRequirement,
            count,
        });
    },
    start: async (codeId, questionId) => {
        const isExistQuestionCode = await QuestionCodeRepository.findOne({
            where: {
                questionId,
                codeId,
            },
        });
        if (isExistQuestionCode) {
            return ResponseFormat.ok();
        }

        const question = await QuestionRepository.findOne({
            where: {
                id: questionId,
            },
        });
        if (!question) {
            return ResponseFormat.error(404, "Câu hỏi không tồn tại!");
        }

        const requirements = await QuestionRequirementRepository.find({
            where: {
                targetId: questionId,
            },
        });

        let valid = true;
        if (requirements.length) {
            const codeRequirement = await QuestionCodeRepository.find({
                where: {
                    codeId,
                    questionId: In(requirements.map((i) => i.requirementId)),
                },
            });

            if (codeRequirement.length !== requirements.length) {
                valid = false;
            }
        }

        if (!valid) {
            return ResponseFormat.error(401, "Chưa đủ điều kiện dể bắt đầu!");
        }

        try {
            const instance = QuestionCodeRepository.create({
                codeId,
                questionId,
                status: QUESTION_CODE_CONSTANT.status.SOLVING,
            });

            await QuestionCodeRepository.save(instance);

            return ResponseFormat.ok();
        } catch (err) {
            console.log(err);
            return ResponseFormat.internal;
        }
    },
    validateAnswere: async (codeId, questionId, query, mode = "check") => {
        const isExistQuestionCode = await QuestionCodeRepository.findOne({
            where: {
                questionId,
                codeId,
            },
        });
        if (!isExistQuestionCode) {
            return ResponseFormat.error(401, "Câu hỏi chưa được mở khoá!");
        }

        let queryRunner = AppClientDataSource.createQueryRunner();

        try {
            await queryRunner.startTransaction();

            const runQuery = await QuestionAdminService.runQuery(
                query,
                queryRunner
            );
            if (!runQuery.success) {
                return ResponseFormat.error(400, runQuery.message);
            }

            const question = await QuestionRepository.findOne({
                where: { id: questionId },
            });
            if (!question) {
                return ResponseFormat.error(404, "Không tồn tại câu hỏi này!");
            }

            if (!question.answere) {
                return ResponseFormat.error(
                    404,
                    "Thiếu thông tin về việc kiểm tra kết quả!"
                );
            }
            const { type, ...rules } = question.answere;
            if (!rules || !type) {
                return ResponseFormat.error(
                    404,
                    "Thiếu thông tin về việc kiểm tra kết quả!"
                );
            }

            let isCorrect = false;

            if (type === "table") {
                const tableData = rules.table;
                if (!tableData) {
                    return ResponseFormat.error(
                        404,
                        "Dữ liệu mẫu không tồn tại!"
                    );
                }
                const tablename = tableData.name;
                if (!tablename)
                    return ResponseFormat.error(400, "Chưa cung cấp tên bảng!");

                if (!tableData.row) {
                    return ResponseFormat.internal;
                }
                try {
                    const query = await queryRunner.query(`
                    SELECT COUNT(*) as "rowCount"
                    FROM ${tablename}
                    ${tableData.condition ? `WHERE ${tableData.condition}` : ""}
                `);

                    const { items, mode } = tableData.row;

                    const rowCount = query[0]?.rowCount || -1;
                    if (rowCount === -1) {
                        return ResponseFormat.internal;
                    }

                    if (mode === "min") isCorrect = rowCount >= items;
                    else if (mode === "max") isCorrect = rowCount <= items;
                    else if (mode === "same") isCorrect = rowCount === items;
                } catch (err) {
                    console.log(err);

                    return ResponseFormat.internal;
                }
            } else if (type === "query") {
                const queryAns = rules.query;
                if (!queryAns?.sql) {
                    console.log("Missing sql query");
                    return ResponseFormat.internal;
                }

                const sampleQuery = rules.query?.sql;
                try {
                    const querySampleRes = await queryRunner.query(sampleQuery);
                    if (!runQuery) {
                        isCorrect = false;
                        throw new Error("Sample sql run failed!");
                    }

                    let colsCompare = rules.query.colData || null;

                    if (!colsCompare) {
                        colsCompare = runQuery.data?.length
                            ? Object.keys(runQuery.data[0])
                            : [];
                    } else if (colsCompare === "*") {
                        colsCompare = querySampleRes.length
                            ? Object.keys(querySampleRes[0])
                            : [];
                    }

                    isCorrect = compareArraysByAttributes(
                        runQuery.data,
                        querySampleRes,
                        colsCompare
                    );
                } catch (err) {
                    console.log(err);
                    return ResponseFormat.error(400, err.message);
                }
            }

            if (mode === "check" || !isCorrect) {
                await queryRunner.rollbackTransaction();
            } else if (mode === "submit") {
                await queryRunner.commitTransaction();
            }
            await queryRunner.release();

            return ResponseFormat.ok({
                isCorrect,
                queryResult: runQuery.data,
            });
        } catch (err) {
            console.log(err);
            await queryRunner.rollbackTransaction();
            await queryRunner.release();

            return ResponseFormat.internal;
        }
    },
    submit: async (codeId, questionId, body) => {
        const { query } = body;

        const validateAns = await QuestionClientService.validateAnswere(
            codeId,
            questionId,
            query,
            "submit"
        );

        const isExistQuestionCode = await QuestionCodeRepository.findOne({
            where: {
                codeId,
                questionId,
            },
        });
        if (!isExistQuestionCode) {
            return ResponseFormat.error(
                404,
                "Chưa có dữ liệu người dùng về câu hỏi này!"
            );
        }

        const instance = QuestionHistoryRepository.create({
            questionCodeId: isExistQuestionCode.id,
            answere: query,
            status: QUESTION_HISTORY_CONSTANT.status[
                validateAns?.data?.isCorrect ? "CORRECT" : "INCORRECT"
            ],
        });

        try {
            await QuestionHistoryRepository.save(instance);

            if (!validateAns.success) return validateAns;

            const [questionExplain, updateStatus] = await Promise.all([
                validateAns.data?.isCorrect
                    ? QuestionRepository.findOne({
                          where: { id: questionId },
                      })
                    : { explain: "" },
                validateAns.data?.isCorrect
                    ? QuestionCodeRepository.update(
                          {
                              id: isExistQuestionCode.id,
                          },
                          {
                              status: QUESTION_CODE_CONSTANT.status.PASS,
                          }
                      )
                    : true,
            ]);

            return ResponseFormat.ok({
                explain: questionExplain.explain,
                ...(validateAns.success ? validateAns.data || {} : {}),
            });
        } catch (err) {
            return ResponseFormat.internal;
        }
    },
    safeRun: async ({ query = "" }) => {
        const queryRunner = AppClientDataSource.createQueryRunner();
        try {
            await queryRunner.startTransaction();
            const runQuery = await QuestionAdminService.runQuery(
                query,
                queryRunner
            );

            return ResponseFormat.ok(runQuery.data);
        } catch (err) {
            console.log(err);
            return ResponseFormat.internal;
        } finally {
            queryRunner.rollbackTransaction();
            queryRunner.release();
        }
    },
    async isUnlock(codeId, questionId) {
        const question = await QuestionRepository.findOne({
            where: {
                id: questionId,
            },
        });
        if (!question) {
            return ResponseFormat.error(404, "Câu hỏi không tồn tại!");
        }

        const questionRequirements = await QuestionRequirementRepository.find({
            where: { targetId: question.id },
        });
        if (!questionRequirements.length) {
            return ResponseFormat.ok();
        }

        const checkIsAllPass = await QuestionCodeRepository.find({
            where: {
                codeId,
                questionId: In(
                    questionRequirements.map((r) => r.requirementId)
                ),
                status: QUESTION_CODE_CONSTANT.status.PASS,
            },
        });

        if (checkIsAllPass.length === questionRequirements.length) {
            return ResponseFormat.ok();
        }

        return ResponseFormat.error(401, "Chưa mở khoá các câu hỏi yêu cầu!");
    },
};

module.exports = QuestionClientService;
