const { In, QueryFailedError } = require("typeorm");
const ResponseFormat = require("../../helper/response");
const EventRepository = require("../../repository/event");
const QuestionRepository = require("../../repository/question");
const QuestionRequirementAdminService = require("../question-requirement/admin.service");
const { validateQuery } = require("../../helper/query");
const { AppClientDataSource } = require("../../lib/database");
const lodash = require("../../lib/lodash");
const QuestionCodeRepository = require("../../repository/question-code");
const QuestionHistoryRepository = require("../../repository/question-history");
const { CodeRepository } = require("../../repository/code");

const QuestionAdminService = {
    list: async (eventId) => {
        const [items, count] = await QuestionRepository.findAndCount({
            where: { eventId },
            order: {
                no: "ASC",
            },
        });

        return ResponseFormat.ok({
            items,
            count,
        });
    },
    create: async ({
        title,
        description,
        preRun = null,
        explain,
        answere = null,
        retriable = false,
        requirements = null,
        content = "",
        eventId,
        no,
    }) => {
        const event = await EventRepository.findOne({ where: { id: eventId } });
        if (!event) {
            return ResponseFormat.error(404, "Sự kiện không tồn tại!");
        }

        if (requirements) {
            const checkRequirements = await QuestionRepository.find({
                where: { id: In(requirements) },
            });
            if (checkRequirements.length !== requirements.length) {
                return ResponseFormat.error(
                    400,
                    "Câu hỏi yêu cầu không hợp lệ!"
                );
            }
        }

        if (preRun) {
            const preRunned = await QuestionAdminService.preprocessAnswere({
                preRun,
            });

            if (!preRunned.success) return preRunned;
        }

        const instance = QuestionRepository.create({
            title,
            description,
            preRun,
            answere,
            explain,
            retriable,
            eventId,
            content,
            no,
        });

        try {
            const savedQuestion = await QuestionRepository.save(instance);

            if (requirements) {
                await QuestionRequirementAdminService.save({
                    requirements,
                    questionId: savedQuestion.id,
                });
            }

            return ResponseFormat.ok();
        } catch (err) {
            return ResponseFormat.internal;
        }
    },
    update: async (body) => {
        const {
            id: questionId,
            title,
            description,
            preRun,
            explain,
            answere,
            retriable,
            requirements,
            content,
            no,
        } = body;

        const question = await QuestionRepository.findOne({
            where: { id: questionId },
        });
        if (!question) {
            return ResponseFormat.error(404, "Câu hỏi không tồn tại!");
        }

        const newBody = {
            ...question,
            title,
            description,
            preRun,
            explain,
            answere,
            retriable,
            no,
            content,
        };

        if (requirements) {
            const checkRequirements = await QuestionRepository.find({
                where: { id: In(requirements) },
            });
            if (checkRequirements.length !== requirements.length) {
                return ResponseFormat.error(
                    400,
                    "Câu hỏi yêu cầu không hợp lệ!"
                );
            }
        }

        if (
            preRun &&
            JSON.stringify(preRun) !== JSON.stringify(question.preRun || "")
        ) {
            const preRunned = await QuestionAdminService.preprocessAnswere({
                preRun,
            });

            if (!preRunned.success) return preRunned;
        }

        try {
            await Promise.all([
                QuestionRepository.update(
                    {
                        id: questionId,
                    },
                    { ...newBody }
                ),
                QuestionRequirementAdminService.update({
                    requirements,
                    questionId,
                }),
            ]);

            return ResponseFormat.ok();
        } catch (err) {
            console.log(err);
            return ResponseFormat.internal;
        }
    },
    delete: async ({ questionIds = [] }) => {
        try {
            await QuestionRepository.softDelete({ id: In(questionIds) });

            return ResponseFormat.ok();
        } catch (err) {
            return ResponseFormat.internal;
        }
    },
    reset: async ({ code, eventId }) => {
        try {
            const coseExixt = await CodeRepository.findOne({
                where: { code: code },
            });
            if (!coseExixt) {
                return ResponseFormat.error(404, "Code không tồn tại!");
            }

            const questions = await QuestionRepository.find({
                where: {
                    eventId,
                },
            });

            const questionCode = await QuestionCodeRepository.find({
                where: {
                    codeId: coseExixt.id,
                    questionId: In(questions.map((i) => i.id)),
                },
            });

            await Promise.all([
                QuestionCodeRepository.delete({
                    id: In(questionCode.map((i) => i.id)),
                }),
                QuestionHistoryRepository.delete({
                    questionCodeId: In(questionCode.map((i) => i.id)),
                }),
            ]);

            return ResponseFormat.ok();
        } catch (err) {
            console.log(err);
            return ResponseFormat.internal;
        }
    },
    async runQuery(query, queryRunner) {
        if (!queryRunner) {
            console.log("Missing queryRunner!");
            return ResponseFormat.internal;
        }

        const vQuery = validateQuery({ query });
        if (!vQuery) {
            return ResponseFormat.error(
                401,
                "Câu truy vấn chứa các từ nhạy cảm!"
            );
        }
        try {
            const runQuery = await queryRunner.query(query);

            return ResponseFormat.ok(runQuery);
        } catch (err) {
            console.log(err);
            if (err instanceof QueryFailedError) {
                return ResponseFormat.badRequest(err.message);
            }

            return ResponseFormat.badRequest("Lỗi câu truy vấn!");
        }
    },
    async preprocessAnswere({ preRun }) {
        let queries = ``;

        for (const table of preRun?.tables || []) {
            let query = "";
            let countRecord = 0;

            try {
                const check = await AppClientDataSource.query(
                    `SELECT count(*) as count FROM ${table.name}`
                );
                countRecord = check[0].count;
            } catch (err) {
                countRecord = 0;
            }

            if (!!countRecord) continue;

            const enumsFields = table.fields.filter((i) => i.enum?.length);
            if (enumsFields.length) {
                query = enumsFields.reduce((acc, curr) => {
                    return `${acc}
                    DROP TYPE IF EXISTS ${table.name}_${curr.name}_enum CASCADE;
                    CREATE TYPE ${table.name}_${
                        curr.name
                    }_enum AS ENUM (${curr.enum
                        .reduce((a, c) => {
                            a.push(`'${c}'`);
                            return a;
                        }, [])
                        .join(",")});`;
                }, "");
            }

            const constraints = [];
            if (table.joins?.length) {
                table.joins.forEach((join) => {
                    constraints.push(`constraint fk_${table.name}_${join.table.name}
                            FOREIGN KEY (${join.col}) REFERENCES ${join.table.name} (${join.table.col})
                            `);
                });
            }

            query += `
                    CREATE TABLE IF NOT EXISTS ${table.name} (
                        ${table.fields.reduce((acc, curr, idx) => {
                            return `${acc}
                            ${curr.name} ${
                                curr.primary
                                    ? "SERIAL PRIMARY KEY"
                                    : `${
                                          curr.type === "enum"
                                              ? `${table.name}_${curr.name}_enum`
                                              : curr.type
                                      } ${
                                          curr.length ? `(${curr.length})` : ""
                                      }`
                            } ${curr.constraints || ""}${
                                idx !== table.fields.length - 1 ? "," : ""
                            }`;
                        }, ``)}${constraints.length ? "," : ""}
                        ${constraints.join(",")}
                    );`;

            if (table.initData?.length) {
                query += `
                    INSERT INTO ${table.name} (${Object.keys(
                    table.initData[0]
                ).join(",")})
                    VALUES
                    ${table.initData
                        .reduce((acc, curr) => {
                            const values = Object.values(curr);
                            acc.push(
                                `(${values.map((i) =>
                                    lodash.isNumber(i) ? i : `'${i}'`
                                )})`
                            );
                            return acc;
                        }, [])
                        .join(",")};`;
            }
            queries += `${queries.length ? ";" : ""} 
                        ${query}`;
        }

        try {
            await AppClientDataSource.query(queries);
            return ResponseFormat.ok();
        } catch (err) {
            console.log(err);
            return ResponseFormat.internal;
        }
    },
};

module.exports = QuestionAdminService;
