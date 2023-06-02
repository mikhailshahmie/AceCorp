////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");
let userData;
main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        main.getDoc(main.doc(main.db, "users", user.uid)).then((doc) => {
            userData = doc.data();
        });
    } else {
    }
});
/////////////////////////////////////////////////////////////////

const signupForm = document.querySelector("#signupForm");

signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const terms = signupForm.terms.checked;
    const fullname = signupForm.fullname.value;
    const email = signupForm.email.value.toLowerCase();
    const matric = signupForm.matric.value.toUpperCase();
    const phoneNumber = signupForm.phoneNumber.value;
    const password = signupForm.password.value;
    const passwordConfirm = signupForm.password2.value;
    let emailRegEx = /[^ ]@graduate.utm.my\i*$/;
    let matricRegEx = /[A-Za-z]\d\d[A-Za-z][A-Za-z]\d\d\d\d\i*$/;
    let phoneRegEx = /^\d+$/;

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
    } else if (!phoneRegEx.test(phoneNumber)) {
        alert("Invalid phone number format");
    } else {
        main.createUserWithEmailAndPassword(main.auth, email, password)
            .then((cred) => {
                if (cred.user != null) {
                    main.setDoc(main.doc(main.db, "users", cred.user.uid), {
                        driverDetails: null,
                        personalDetails: {
                            fullname: fullname,
                            email: email,
                            matric: matric,
                            phoneNumber: phoneNumber,
                        },
                        type: "passenger",
                    }).then(() => {
                        signupForm.reset;
                    });

                    main.updateProfile(cred.user, {
                        photoURL: "https://firebasestorage.googleapis.com/v0/b/utm-transporter.appspot.com/o/profilePicture%2Fdefault.jpg?alt=media&token=5d309385-bd0e-44fd-b69f-5362d6f8eee6",
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
