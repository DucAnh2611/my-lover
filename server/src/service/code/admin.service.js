const { Not } = require("typeorm");
const CODE_CONSTANTS = require("../../constant/code");
const ResponseFormat = require("../../helper/response");
const { CodeRepository } = require("../../repository/code");

const [ME, YOU] = CODE_CONSTANTS.TYPES;

const CodeAdminService = {
    list: async () => {
        const [items, count] = await CodeRepository.findAndCount();
        return ResponseFormat.ok({ items, count });
    },
    create: async ({ code, type }) => {
        if (!code) {
            return ResponseFormat.badRequest("Chưa cung cấp code!");
        }
        if (!type) {
            return ResponseFormat.badRequest("Chưa cung cấp type!");
        }

        if (code.toString().length !== 6) {
            return ResponseFormat.badRequest("Code phải dài đúng 6 ký tự!");
        }
        if (!CODE_CONSTANTS.TYPES.includes(type)) {
            return ResponseFormat.badRequest("Loại code không hợp lệ!");
        }

        if (type === ME) {
            const countMyCode = await CodeRepository.count({
                type: ME,
            });
            if (countMyCode) {
                return ResponseFormat.badRequest(
                    "Tồn tại nhiều hơn 1 code của bạn!"
                );
            }
        }
        const codeExist = await CodeRepository.findOne({
            where: {
                code,
            },
            loadEagerRelations: false,
        });

        if (codeExist) {
            return ResponseFormat.badRequest("Code đã tồn tại");
        }

        const newCode = CodeRepository.create({
            code,
            type,
        });
        try {
            await CodeRepository.save(newCode);

            return ResponseFormat.ok();
        } catch (error) {
            console.log(error);
            return ResponseFormat.internal;
        }
    },
    activeState: async ({ active, code }) => {
        if (!code) {
            return ResponseFormat.badRequest("Chưa cung cấp code!");
        }
        if (code.toString().length !== 6) {
            return ResponseFormat.badRequest("Code phải dài đúng 6 ký tự!");
        }

        const codeExist = await CodeRepository.findOne({
            where: {
                code,
            },
            loadEagerRelations: false,
        });

        if (!codeExist) {
            return ResponseFormat.badRequest("Code không tồn tại!");
        }

        if (codeExist.type === CODE_CONSTANTS.TYPES[0]) {
            const countCodeMeLeft = await CodeRepository.count({
                where: {
                    code: Not(code),
                    type: CODE_CONSTANTS.TYPES[0],
                },
            });

            if (countCodeMeLeft < 1) {
                return ResponseFormat.error(
                    400,
                    "Ít nhất 1 code loại 'YOU' phải hoạt động!"
                );
            }
        }

        if (codeExist.isActive === active) {
            return ResponseFormat.badRequest(
                `Đã ở trạng thái ${active ? "hoạt động" : "vô hiệu hóa"}!`
            );
        }

        try {
            await CodeRepository.update(
                {
                    id: codeExist.id,
                },
                {
                    isActive: active,
                }
            );

            return ResponseFormat.ok();
        } catch (error) {
            console.log(error);
            return ResponseFormat.internal;
        }
    },
    changeCode: async ({ id, code }) => {
        if (!id) {
            return ResponseFormat.badRequest("Chưa cung cấp id!");
        }
        if (!code) {
            return ResponseFormat.badRequest("Chưa cung cấp code!");
        }
        if (code.toString().length !== 6) {
            return ResponseFormat.badRequest("Code phải dài đúng 6 ký tự!");
        }

        const codeExist = await CodeRepository.findOne({
            where: {
                id,
            },
            loadEagerRelations: false,
        });

        if (!codeExist) {
            return ResponseFormat.badRequest("Code không tồn tại!");
        }

        try {
            await CodeRepository.update(
                {
                    id: codeExist.id,
                },
                {
                    code: code,
                }
            );

            return ResponseFormat.ok();
        } catch (error) {
            console.log(error);
            return ResponseFormat.internal;
        }
    },
    deleteCode: async ({ code }) => {
        if (!code) {
            return ResponseFormat.badRequest("Chưa cung cấp code!");
        }
        if (code.toString().length !== 6) {
            return ResponseFormat.badRequest("Code phải dài đúng 6 ký tự!");
        }

        const codeExist = await CodeRepository.findOne({
            where: {
                code,
            },
            loadEagerRelations: false,
        });

        if (codeExist.type === CODE_CONSTANTS.TYPES[0]) {
            const countCodeMeLeft = await CodeRepository.count({
                where: {
                    code: Not(code),
                    type: CODE_CONSTANTS.TYPES[0],
                },
            });

            if (countCodeMeLeft < 1) {
                return ResponseFormat.error(
                    400,
                    "Ít nhất 1 code loại 'YOU' phải hoạt động!"
                );
            }
        }

        if (!codeExist) {
            return ResponseFormat.badRequest("Code không tồn tại!");
        }

        try {
            await CodeRepository.softDelete({
                id: codeExist.id,
            });

            return ResponseFormat.ok();
        } catch (error) {
            console.log(error);
            return ResponseFormat.internal;
        }
    },
};

module.exports = CodeAdminService;
