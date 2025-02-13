const { In } = require("typeorm");
const ResponseFormat = require("../../helper/response");
const EventRepository = require("../../repository/event");

const EventAdminService = {
    list: async () => {
        const [items, count] = await EventRepository.findAndCount();

        return ResponseFormat.ok({
            items,
            count,
        });
    },
    create: async (body) => {
        const { name, description, start, prize = null, end = null } = body;

        try {
            if (new Date(start) < new Date()) {
                return ResponseFormat.badRequest(
                    "Thời gian bắt đầu sự kiện không hợp lệ!"
                );
            }

            if (end && new Date(start) > new Date(end)) {
                return ResponseFormat.badRequest(
                    "Thời gian kết thúc không hợp lệ!"
                );
            }

            const instance = EventRepository.create({
                name,
                description,
                prize,
                start: new Date(start),
                end: end ? new Date(end) : end,
            });

            await EventRepository.save(instance);

            return ResponseFormat.ok();
        } catch (error) {
            console.log(error);
            return ResponseFormat.internal;
        }
    },
    update: async (body) => {
        const { id, name, description, prize = null, start, end = null } = body;

        try {
            // if (new Date(start) < new Date()) {
            //     return ResponseFormat.badRequest(
            //         "Thời gian bắt đầu sự kiện không hợp lệ!"
            //     );
            // }

            if (end && new Date(start) > new Date(end)) {
                return ResponseFormat.badRequest(
                    "Thời gian kết thúc không hợp lệ!"
                );
            }

            const validEvent = await EventRepository.findOne({ where: { id } });

            if (!validEvent) {
                return ResponseFormat.error(404, "Sự kiện không hợp lệ!");
            }

            await EventRepository.update(
                {
                    id,
                },
                {
                    name,
                    description,
                    prize,
                    start: new Date(start),
                    end: !!end ? new Date(end) : validEvent.end,
                }
            );

            return ResponseFormat.ok();
        } catch (error) {
            return ResponseFormat.internal;
        }
    },
    delete: async ({ ids = [] }) => {
        try {
            await EventRepository.softDelete({
                id: In(ids),
            });

            return ResponseFormat.ok();
        } catch (error) {
            return ResponseFormat.internal;
        }
    },
};

module.exports = EventAdminService;
