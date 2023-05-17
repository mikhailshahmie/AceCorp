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
});

newAdminForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = newAdminForm.username.value;
    const email = newAdminForm.email.value;
    const password = newAdminForm.password.value;

    // Logic to save the new admin here
    alert("New admin saved successfully!");

    // Clear the form and hide the new admin form
    newAdminForm.reset;
    newAdminForm.classList.remove("show");
    newAdminBtn.style.visibility = "visible";
});
