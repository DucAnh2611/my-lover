const { Not, In } = require("typeorm");
const ResponseFormat = require("../../helper/response");
const QuestionRequirementRepository = require("../../repository/question-requirement");

const QuestionRequirementAdminService = {
    save: async ({ requirements, questionId }) => {
        const instances = requirements.map((requirement) =>
            QuestionRequirementRepository.create({
                targetId: questionId,
                requirementId: requirement,
            })
        );

        try {
            await QuestionRequirementRepository.save(instances);

            return ResponseFormat.ok();
        } catch (err) {
            return ResponseFormat.internal;
        }
    },
    update: async ({ requirements, questionId }) => {
        if (!requirements) return ResponseFormat.ok();

        const getRequirements = await QuestionRequirementRepository.find({
            where: {
                targetId: questionId,
            },
        });

        let mapRequirement = "";

        getRequirements.forEach((r) => {
            mapRequirement += ` ${r.requirementId}`;
        });

        const newRequirement = [];

        for (const requirement of requirements) {
            if (!mapRequirement.includes(requirement)) {
                newRequirement.push(requirement);
            }
        }

        const newInstances = newRequirement.map((r) =>
            QuestionRequirementRepository.create({
                targetId: questionId,
                requirementId: r,
            })
        );

        try {
            await Promise.all([
                QuestionRequirementRepository.delete({
                    targetId: questionId,
                    requirementId: Not(In(requirements)),
                }),
                QuestionRequirementRepository.save(newInstances),
            ]);

            return ResponseFormat.ok();
        } catch (err) {
            console.log(err);
            return ResponseFormat.internal;
        }
    },
};

module.exports = QuestionRequirementAdminService;
