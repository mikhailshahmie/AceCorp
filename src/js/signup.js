const main = require("./main.js"); //MUST HAVE

const signupForm = document.querySelector("#signupForm"); /*
const signupbtn = document.querySelector("#signupbtn");
const fullnamebox = document.querySelector("#fullname");
const emailbox = document.querySelector("#email");
const matricbox = document.querySelector("#matric");
const passwordbox = document.querySelector("#password");
const passwordConfirmbox = document.querySelector("#password2");
*/
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const terms = signupForm.terms.checked;
    const fullname = signupForm.fullname.value;
    const email = signupForm.email.value.toLowerCase();
    const matric = signupForm.matric.value;
    const password = signupForm.password.value;
    const passwordConfirm = signupForm.password2.value;
    let emailRegEx = /[A-Za-z]+@graduate.utm.my\i*$/;
    let matricRegEx = /[A-Za-z]\d\d[A-Za-z][A-Za-z]\d\d\d\d\i*$/;

    if (!fullname) {
        alert("Name is missing");
    } else if (!emailRegEx.test(email)) {
        alert("Invalid email, please use UTM official student email");
    } else if (!matricRegEx.test(matric)) {
        alert("Invalid matric number format");
    } else if (password != passwordConfirm) {
        alert("Passwords are not the same");
    } else if (!terms) {
        alert("Please agree to these terms");
    } else {
        main.createUserWithEmailAndPassword(main.auth, email, password)
            .then((cred) => {
                if (cred.user != null) {
                    main.setDoc(main.doc(main.db, "users", cred.user.uid), {
                        fullname: fullname,
                        email: email,
                        matric: matric,
                        type: "passenger",
                    }).then(() => {
                        signupForm.reset;
                    });

                    main.sendEmailVerification(cred.user)
                        .then(() => {
                            alert("Account created successfully, please check your email for verification");
                            window.location.href = "/signin.html";
                        })
                        .catch((err) => {
                            alert(err.message);
                        });
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    }
});
