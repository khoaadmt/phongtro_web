const mysql = require("mysql");
var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    port: "3308",
    database: "phongtro",
});
export const createNewUser_historyService = (userId, action, id) =>
    new Promise(async (resolve, reject) => {
        const detail = action + " " + id;
        try {
            const sql =
                "INSERT INTO user_history (user_id, action, detail, timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)";
            conn.query(sql, [userId, action, detail], function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
