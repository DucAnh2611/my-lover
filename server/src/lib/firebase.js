const admin = require("firebase-admin");
const FirebaseConfig = require("../config/firebase");

function FirebaseAdminInitial() {
    try {
        admin.initializeApp({
            credentials: admin.credential.cert(
                JSON.parse(FirebaseConfig.serviceAccountKey)
            ),
        });
        console.log("[Done] Firebase Admin");
    } catch (error) {
        console.log("=== Firebase Admin Initial Error ===");
        console.error(error);
    }
}

module.exports = FirebaseAdminInitial;
