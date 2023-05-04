////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");
main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        main.getDoc(main.doc(main.db, "users", user.uid)).then((doc) => {
            userData = doc.data();
            console.log(userData);
            if (userData.type != "admin") {
                main.signOut(main.auth)
                    .then(() => {
                        alert("Logging out...");
                        window.location.href = "/loginadmin.html";
                    })
                    .catch((error) => {
                        console.log(error.message);
                    });
            } else {
                window.location.href = "/adminmain.html";
            }
        });
    } else {
        window.location.href = "/loginadmin.html";
    }
});
/////////////////////////////////////////////////////////////////

const signoutbtn = document.querySelector("#signoutbtn");

signoutbtn.addEventListener("click", (e) => {
    main.signOut(main.auth)
        .then(() => {
            alert("Signing out...");
            window.location.href = "/loginadmin.html";
        })
        .catch((error) => {
            console.log(error.message);
        });
});
