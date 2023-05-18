////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");
main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        //MAY NEED TO CHANGE
        main.getDoc(main.doc(main.db, "users", user.uid)).then((doc) => {
            userData = doc.data();
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
const newAdminBtn = document.querySelector("#newAdminBtn");
const newAdminForm = document.querySelector("#newAdminForm");

//Signout
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

//Open add new admin form
newAdminBtn.addEventListener("click", (e) => {
    e.preventDefault();
    newAdminForm.classList.add("show");
    newAdminBtn.style.visibility = "hidden";
    console.log(main.auth.currentUser);
    console.log(main.auth2.currentUser);
});

newAdminForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = newAdminForm.username.value;
    const email = newAdminForm.email.value;
    const password = newAdminForm.password.value;

    // Logic to save the new admin here

    main.createUserWithEmailAndPassword(main.auth2, email, password)
        .then((cred) => {
            if (cred.user != null) {
                main.updateProfile(main.auth2.currentUser, {
                    displayName: username,
                })
                    .then(() => {
                        main.setDoc(main.doc(main.db, "admins", username), {
                            email: email,
                            type: "admin",
                            uid: cred.user.uid,
                        }).then(() => {
                            // Clear the form and hide the new admin form
                            alert("New admin saved successfully!");
                            newAdminForm.reset;
                            newAdminForm.classList.remove("show");
                            newAdminBtn.style.visibility = "visible";
                            main.signOut(main.auth2);
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        })
        .catch((err) => {
            alert(err.message);
        });
});
