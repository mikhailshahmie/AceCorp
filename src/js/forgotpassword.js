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
                alert("Reset Form has been send to you!. Please check your email.");
                resetForm.reset();
            })
            .catch((error) => {
                alert(error.message);
            });
    } else {
        alert("Please enter valid UTM student email");
    }
});
