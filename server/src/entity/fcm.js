const { EntitySchema } = require("typeorm");

const FcmEntity = new EntitySchema({
    name: "fcm",
    tableName: "fcm",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
        },
        token: {
            nullable: false,
            type: "varchar",
            length: 255,
        },
        isActive: {
            type: "boolean",
            default: true,
        },
        createdAt: {
            type: "timestamp with time zone",
            createDate: true,
        },
        updatedAt: {
            type: "timestamp with time zone",
            updateDate: true,
        },
    },
});

module.exports = FcmEntity;
