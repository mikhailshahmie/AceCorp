////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");
let userData;

main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        let emailRegEx = /[^ ]@graduate.utm.my\i*$/;
        if (!emailRegEx.test(user.email)) {
            window.location.href = "/adminmain.html";
        }
        main.getDoc(main.doc(main.db, "users", user.uid)).then((doc) => {
            userData = doc.data();
            const redirectBtn = document.querySelector("#redirect");
            if (userData.type == "passenger") {
                redirectBtn.href = "driver-application.html";
                redirectBtn.text = "Be a Driver";
            } else if (userData.type == "driver") {
                //NEED CHANGING
                redirectBtn.href = "driver-home.html";
                redirectBtn.text = "Driver dashboard";
            }
        });

        //CHECK IF THE CURRENT USER HAVE AN ACTIVE BOOKING
        const q = main.query(main.bookingDB, main.where("passengerId", "==", main.auth.currentUser.uid));
        main.onSnapshot(q, (snapshot) => {
            let history = [];
            if (!snapshot.empty) {
                snapshot.docs.forEach((doc) => {
                    history.push({ ...doc.data(), bookingId: doc.id });
                });
                console.log(history);
            }
        });
    } else {
        window.location.href = "/signin.html";
    }
});
/////////////////////////////////////////////////////////////////

//LOGOUT
const signoutbtn = document.querySelector("#signoutbtn");

signoutbtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Are you sure you want to sign out?")) {
        main.signOut(main.auth)
            .then(() => {
                alert("Signing out...");
                window.location.href = "/signin.html";
            })
            .catch((error) => {
                console.log(error.message);
            });
    }
});
