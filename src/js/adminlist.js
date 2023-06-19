////////////////////////////MUST HAVE////////////////////////////
import $ from "jquery";
const main = require("./main.js");
let userData;
main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        let emailRegEx = /[^ ]@graduate.utm.my\i*$/;
        if (emailRegEx.test(user.email)) {
            main.signOut(main.auth)
                .then(() => {
                    alert("Logging out...");
                    window.location.href = "/loginadmin.html";
                })
                .catch((error) => {
                    console.log(error.message);
                });
        }
        main.onSnapshot(main.adminDB, (snapshot) => {
            let admins = [];
            const adminListTable = document.querySelector("#adminListTable");
            if (!snapshot.empty) {
                snapshot.docs.forEach((doc) => {
                    admins.push({ ...doc.data(), username: doc.id });
                });
                $("#adminListTable tr").remove();
                adminListTable.innerHTML = "<tr><th>Username</th><th>Email</th></tr>";

                admins.forEach((admin) => {
                    adminListTable.innerHTML += "<tr><td>" + admin.username + "</td><td>" + admin.email + "</td></tr>";
                });
            } else {
                adminListTable.innerHTML = '<tr><th>Username</th><th>Email</th></tr><tr><td colspan="2" style="text-align: center">NO ADMIN FOUND</td></tr>';
            }
        });
    } else {
        window.location.href = "/loginadmin.html";
    }
});
/////////////////////////////////////////////////////////////////
