////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");

const resetForm = document.querySelector("#resetForm");

resetForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = resetForm.email.value;
    let emailRegEx = /[^ ]@graduate.utm.my\i*$/;
    if (emailRegEx.test(email)) {
        main.sendPasswordResetEmail(main.auth, email)
            .then((cred) => {
                main.onAuthStateChanged(main.auth, (user) => {
                    if (user) {
                        if (!user.emailVerified) {
                            alert("Please check your email for verification (Please check in spam too if you don't see it)");
                        } else {
                            alert("Reset Form has been send to you!. Please check your email.");
                            resetForm.reset();
                        }
                    } else {
                    }
                });
            })
            .catch((error) => {
                alert(error.message);
            });
    } else {
        alert("Please enter valid UTM student email");
    }
});