////////////////////////////MUST HAVE////////////////////////////
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
        main.getDoc(main.doc(main.db, "admins", user.displayName)).then((doc) => {
            userData = doc.data();
            const email = document.querySelector("#email");
            const username = document.querySelector("#username");

            email.textContent = userData.email;
            username.textContent = user.displayName;
        });
    } else {
    }
});
/////////////////////////////////////////////////////////////////

const editProfileForm = document.querySelector("#editProfileForm");

editProfileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const oldPassword = editProfileForm.old_password.value;
    const newPassword = editProfileForm.new_password.value;
    const confirmPassword = editProfileForm.confirm_password.value;

    if (newPassword == confirmPassword) {
        const credentials = main.EmailAuthProvider.credential(userData.email, oldPassword);
        main.reauthenticateWithCredential(main.auth.currentUser, credentials)
            .then(() => {
                main.updatePassword(main.auth.currentUser, newPassword);
                alert("Update successful");
                window.location.href = "/loginadmin.html";
            })
            .catch((error) => {
                alert(error.message);
            });
    } else {
        alert("Password are not the same");
    }
});
