const EVENT_SCENARIO = {
    ["TET"]: {
        QUES_QUANTITY: 6,
        QUES_DETAIL: [
            {
                title: "Lấy danh sách các món ăn truyền thống trong dịp tết, sắp xếp tên theo thứ tự từ A - Z (ASC)",
                preRun: {
                    tables: [
                        {
                            name: "foods",
                            fields: [
                                {
                                    name: "id",
                                    primary: true,
                                },
                                {
                                    name: "ten",
                                    type: "varchar",
                                    length: 255,
                                    constraints: "NOT NULL",
                                },
                                {
                                    name: "phan_loai",
                                    type: "enum",
                                    enum: [
                                        "TRUYEN_THONG",
                                        "BINH_DAN",
                                        "DAC_SAN",
                                    ],
                                    constraints: "NOT NULL",
                                },
                                {
                                    name: "vung_mien",
                                    type: "enum",
                                    enum: ["BAC", "TRUNG", "NAM"],
                                    constraints: "NOT NULL",
                                },
                            ],
                            initData: [
                                {
                                    ten: "Bánh chưng",
                                    phan_loai: "TRUYEN_THONG",
                                    vung_mien: "BAC",
                                },
                                {
                                    ten: "Bánh tẻ",
                                    phan_loai: "TRUYEN_THONG",
                                    vung_mien: "NAM",
                                },
                            ],
                        },
                    ],
                },
                answere: {
                    type: "query",
                    query: {
                        sql: `
                            SELECT id, ten, vung_mien
                            FROM foods 
                            WHERE phan_loai = 'TRUYEN_THONG'
                            ORDER BY ten ASC
                        `,
                        colData: ["id", "ten", "vung_mien"],
                    },
                },
            },
            {
                title: "Lấy danh sách các món ăn truyền thống mà anh thích hoac rất thích, sắp xếp tên theo thứ tự từ A - Z (ASC)",
                preRun: {
                    tables: [
                        {
                            name: "fav_foods",
                            fields: [
                                {
                                    name: "id",
                                    primary: true,
                                },
                                {
                                    name: "foodId",
                                    type: "integer",
                                },
                                {
                                    name: "muc_do_yeu_thich",
                                    type: "enum",
                                    enum: ["RAT_THICH", "THICH", "BINH_THUONG"],
                                    constraints: "NOT NULL",
                                },
                                {
                                    name: "doi_tuong",
                                    type: "enum",
                                    enum: ["DUC_ANH", "COCA"],
                                    constraints: "NOT NULL",
                                },
                            ],
                            joins: [
                                {
                                    col: "foodId",
                                    table: {
                                        name: "foods",
                                        col: "id",
                                    },
                                },
                            ],
                            initData: [
                                {
                                    foodId: 1,
                                    muc_do_yeu_thich: "RAT_THICH",
                                    doi_tuong: "DUC_ANH",
                                },
                            ],
                        },
                    ],
                },
                answere: {
                    type: "query",
                    query: {
                        sql: `
                            SELECT DISTINCT f.id, f.ten, ff.muc_do_yeu_thich
                            FROM foods as f INNER JOIN fav_foods AS ff ON f.id = ff.foodId
                            WHERE ff.doi_tuong = 'DUC_ANH'
                            ORDER BY ten ASC
                        `,
                        colData: ["id", "ten", "muc_do_yeu_thich"],
                    },
                },
            },
            {
                title: "Thêm vào bảng các món ăn truyền thống mà em thích, hoặc đơn giản là các món em thích. Ít nhất 1.",
                answere: {
                    type: "table",
                    table: {
                        name: "fav_foods",
                        row: {
                            items: 1,
                            mode: "min",
                        },
                        condition: "doi_tuong = 'COCA'",
                    },
                },
            },
            {
                title: "Tìm ra các món ăn mà cả anh và em đều thích (muc_do_yeu_thich: 'RAT_THICH', 'THICH'). Sắp xếp từ cao tới thấp ('COCA' -> 'DUC_ANH')",
                answere: {
                    type: "query",
                    query: {
                        sql: `
                            SELECT f.id, f.ten, f.vung_mien, ff.muc_do_yeu_thich
                            FROM foods as f INNER JOIN fav_foods AS ff ON f.id = ff.foodId
                            WHERE muc_do_yeu_thich IN ('RAT_THICH', 'THICH')
                            ORDER BY ff.doi_tuong DESC
                        `,
                        colData: ["id", "ten", "vung_mien", "muc_do_yeu_thich"],
                    },
                },
            },
            {
                title: "Thêm một vài kế hoạch cho năm mới nhé!",
                preRun: {
                    table: [
                        {
                            name: "plans",
                            fields: [
                                {
                                    name: "id",
                                    primary: true,
                                },
                                {
                                    name: "ten",
                                    type: "text",
                                    constraints: "NOT NULL",
                                },
                                {
                                    name: "chi_tiet",
                                    type: "text",
                                    constraints: "NOT NULL",
                                },
                                {
                                    name: "doi_tuong",
                                    type: "enum",
                                    enum: ["DUC_ANH", "COCA"],
                                    constraints: "NOT NULL",
                                },
                            ],
                            initData: [],
                        },
                    ],
                },
                answere: {
                    type: "table",
                    table: {
                        name: "plans",
                        row: {
                            items: 1,
                            mode: "min",
                        },
                        condition: "doi_tuong = 'COCA'",
                    },
                },
            },
            {
                title: "Lời chúc của anh gửi tới em và gia đình, Sắp xếp theo thứ tự giảm dần (GIA_DINH -> EM)",
                preRun: {
                    table: [
                        {
                            name: "wishes",
                            fields: [
                                {
                                    name: "id",
                                    primary: true,
                                },
                                {
                                    name: "loi_chuc",
                                    type: "text",
                                    constraints: "NOT NULL",
                                },
                                {
                                    name: "doi_tuong",
                                    type: "enum",
                                    enum: ["DUC_ANH", "COCA"],
                                    constraints: "NOT NULL",
                                },
                                {
                                    name: "nguoi_nhan",
                                    type: "text",
                                    constraints: "NOT NULL",
                                },
                                {
                                    name: "nam",
                                    type: "integer",
                                    constraints: "NOT NULL",
                                },
                            ],
                            initData: [],
                        },
                    ],
                },
                answere: {
                    type: "query",
                    query: {
                        sql: `
                            SELECT id, loi_chuc, doi_tuong, nguoi_nhan, nam
                            FROM wishes
                            WHERE nam = 2025 AND doi_tuong = 'DUC_ANH'
                        `,
                        colData: [
                            "id",
                            "loi_chuc",
                            "doi_tuong",
                            "nguoi_nhan",
                            "nam",
                        ],
                    },
                },
            },
        ],
        PRIZE: [
            {
                name: "lixi",
                quantity: 501025,
            },
        ],
    },
    ["VALENTINE"]: {
        QUES_QUANTITY: 14,
        QUES_DETAIL: [
            {
                requirement:
                    "Viết câu truy vấn liệt kê các ngày quan trọng đối với anh!",
                preRun: {
                    tables: [
                        {
                            name: "moc_thoi_gian_quan_trong",
                            fields: [
                                {
                                    name: "id",
                                    primary: true,
                                },
                                {
                                    name: "thoi_gian",
                                    type: "timestamp with time zone",
                                    constraints: "NOT NULL",
                                },
                                {
                                    name: "ten",
                                    type: "varchar",
                                    length: 255,
                                    constraints: "NOT NULL",
                                },
                                {
                                    name: "doi_tuong",
                                    type: "enum",
                                    enum: ["DUC_ANH", "COCA"],
                                    constraints: "NOT NULL",
                                },
                            ],
                            initData: [
                                {
                                    ten: "Lần đầu tiếp xúc",
                                    thoi_gian: "21/12/2024",
                                    doi_tuong: "DUC_ANH",
                                },
                                {
                                    ten: "Lần đầu gặp mặt",
                                    thoi_gian: "29/12/2024",
                                    doi_tuong: "DUC_ANH",
                                },
                                {
                                    ten: "Mua trà sữa cho em",
                                    thoi_gian: "02/01/2025",
                                    doi_tuong: "DUC_ANH",
                                },
                                {
                                    ten: "Sang nhà em chơi",
                                    thoi_gian: "04/01/2025",
                                    doi_tuong: "DUC_ANH",
                                },
                                {
                                    ten: "Anh tỏ tình",
                                    thoi_gian: "05/01/2025",
                                    doi_tuong: "DUC_ANH",
                                },
                                {
                                    ten: "Bắt đầu yêu xa",
                                    thoi_gian: "13/01/2025",
                                    doi_tuong: "DUC_ANH",
                                },
                                {
                                    ten: "Hehe ngại quá",
                                    thoi_gian: "12/01/2025",
                                    doi_tuong: "DUC_ANH",
                                },
                                {
                                    ten: "Gặp lại emmmm",
                                    thoi_gian: "05/02/2025",
                                    doi_tuong: "DUC_ANH",
                                },
                                {
                                    ten: "Tặng quà 14/02 cho elm",
                                    thoi_gian: "11/02/2025",
                                    doi_tuong: "DUC_ANH",
                                },
                            ],
                        },
                    ],
                },
                answere: {
                    type: "query",
                    query: {
                        sql: "SELECT id, ten, thoi_gian FROM moc_thoi_gian_quan_trong WHERE doi_tuong = 'DUC_ANH' ORDER BY thoi_gian DESC",
                        colData: ["id", "ten", "thoi_gian"],
                    },
                },
            },
            {
                preRun: {
                    tables: [
                        {
                            name: "an_tuong_ca_nhan",
                            fields: [
                                {
                                    name: "id",
                                    primary: true,
                                },
                                {
                                    name: "nguoi_an_tuong",
                                    type: "enum",
                                    enum: ["DUC_ANH", "COCA"],
                                    constraints: "NOT NULL",
                                },
                                {
                                    name: "doi_tuong_an_tuong",
                                    type: "enum",
                                    enum: ["DUC_ANH", "COCA"],
                                    constraints: "DEFAULT NULL",
                                },
                                {
                                    name: "xep_hang",
                                    type: "integer",
                                    constraints: "NOT NULL",
                                },
                                {
                                    name: "ten",
                                    type: "text",
                                    constraints: "NOT NULL",
                                },
                                {
                                    name: "li_do",
                                    type: "text",
                                    constraints: "NOT NULL",
                                },
                            ],
                            initData: [
                                {
                                    nguoi_an_tuong: "DUC_ANH",
                                    doi_tuong_an_tuong: "COCA",
                                    xep_hang: 1,
                                    ten: "Học giỏi",
                                    li_do: "Anh thích những bạn học giỏi, cảm giác họ rất tri thức, high value hơn là các bạn mông đít @@.",
                                },
                            ],
                        },
                    ],
                },
                answere: {
                    type: "query",
                    query: {
                        sql: "SELECT id, nguoi_an_tuong, doi_tuong_an_tuong, ten, xep_hang, li_do FROM an_tuong_ca_nhan WHERE nguoi_an_tuong = 'DUC_ANH' AND muc_tieu_an_tuong = 'COCA' ORDER BY xep_hang ASC",
                        colData: [
                            "id",
                            "nguoi_an_tuong",
                            "doi_tuong_an_tuong",
                            "ten",
                            "xep_hang",
                            "li_do",
                        ],
                    },
                },
            },
            {
                answere: {
                    type: "table",
                    table: {
                        name: "moc_thoi_gian_quan_trong",
                        row: {
                            items: 2,
                            mode: "min",
                        },
                        condition: "doi_tuong = 'COCA'",
                    },
                },
            },
            {
                preRun: {
                    tables: [
                        {
                            name: "du_dinh_tuong_lai",
                            fields: [
                                {
                                    name: "id",
                                    primary: true,
                                },
                                {
                                    name: "ten",
                                    type: "text",
                                    constraints: "NOT NULL",
                                },
                                {
                                    name: "nam",
                                    type: "text",
                                    constraints: "NOT NULL",
                                },
                                {
                                    name: "doi_tuong",
                                    type: "enum",
                                    enum: ["COCA", "DUC_ANH"],
                                },
                            ],
                            initData: [
                                {
                                    ten: "Yêu em cho đến khi không thể",
                                    nam: "2025",
                                    doi_tuong: "DUC_ANH",
                                },
                            ],
                        },
                    ],
                },
                answere: {
                    type: "table",
                    table: {
                        name: "du_dinh_tuong_lai",
                        row: {
                            items: 2,
                            mode: "min",
                        },
                        condition: "doi_tuong = 'COCA'",
                    },
                },
            },
        ],
    },
};

module.exports = { EVENT_SCENARIO };
