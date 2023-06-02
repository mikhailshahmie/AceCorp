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
            main.getDoc(main.doc(main.db, "driverRequest", user.uid))
                .then((request) => {
                    if (request == null) {
                        console.log("No pending request");
                    } else {
                        requestData = request.data();
                        if (requestData.status == "pending") {
                            alert("You have pending request, please wait for your verification status");
                            window.location.href = "/home.html";
                        }
                    }
                })
                .catch((err) => {});
        });
    } else {
        window.location.href = "/signin.html";
    }
});
/////////////////////////////////////////////////////////////////

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

const requestForm = document.querySelector("#requestForm");

requestForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const licenseImg = requestForm.licenseImg.files[0];
    const matricImg = requestForm.matricImg.files[0];
    const licenseRef = main.ref(main.storage, "driver/" + main.auth.currentUser.uid + "/license");
    const matricRef = main.ref(main.storage, "driver/" + main.auth.currentUser.uid + "/matric");
    main.uploadBytes(licenseRef, licenseImg)
        .then((license) => {
            main.uploadBytes(matricRef, matricImg).then((matric) => {
                main.getDownloadURL(license.ref).then((licenseUrl) => {
                    main.getDownloadURL(matric.ref).then((matricUrl) => {
                        main.setDoc(main.doc(main.db, "driverRequest", main.auth.currentUser.uid), {
                            license: licenseUrl,
                            matric: matricUrl,
                            status: "pending",
                        }).then(() => {
                            alert("Request sent successfully");
                            window.location.href = "/home.html";
                        });
                    });
                });
            });
        })
        .catch((err) => {
            console.log(err.message);
            alert("Error uploading images");
        });
});
