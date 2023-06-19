////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");
let userData;

//PROFILE FORM
const detailsForm = document.querySelector("#detailsForm");
const profileImg = document.querySelector("#profileImg");
main.onAuthStateChanged(main.auth, (user) => {
    if (user) {
        let emailRegEx = /[^ ]@graduate.utm.my\i*$/;
        if (!emailRegEx.test(user.email)) {
            window.location.href = "/adminmain.html";
        }
        main.onSnapshot(main.doc(main.db, "users", user.uid), (doc) => {
            userData = doc.data();
            //CHANGE DRIVER OR PASSENGER BUTTON
            const redirectBtn = document.querySelector("#redirect");

            //UPDATE FORM WITH USER DATA
            detailsForm.fullname.value = userData.personalDetails.fullname;
            detailsForm.email.value = userData.personalDetails.email;
            detailsForm.matric.value = userData.personalDetails.matric;
            detailsForm.phoneNumber.value = userData.personalDetails.phoneNumber;
            profileImg.src = user.photoURL;

            if (userData.type == "passenger") {
                redirectBtn.href = "driver-application.html";
                redirectBtn.text = "Be a Driver";
                document.getElementById("driverForm").style.display = "none";
            } else if (userData.type == "driver") {
                //NEED CHANGING
                redirectBtn.href = "driver-home.html";
                redirectBtn.text = "Driver dashboard";
                document.getElementById("driverForm").style.display = "block";

                //UPDATE FORM WITH USER FOR DRIVER
                detailsForm.vehicleColour.value = userData.driverDetails.vehicle.colour;
                detailsForm.plateNumber.value = userData.driverDetails.vehicle.plateNumber;
                detailsForm.vehicleType.value = userData.driverDetails.vehicle.type;
            }
        });
    } else {
        window.location.href = "/signin.html";
    }
});

//Sign Out Functionality
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

//UPDATE PROFILE DATA
detailsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //UPDATE PROFILE PIC
    const profilePicUploaded = detailsForm.fileUploaded.files;
    if (profilePicUploaded.length > 0) {
        let newProfilePic = profilePicUploaded[0];
        const profilePicRef = main.ref(main.storage, "profilePicture/" + main.auth.currentUser.uid);

        main.uploadBytes(profilePicRef, newProfilePic).then((profilePic) => {
            main.getDownloadURL(profilePic.ref).then((profilePicUrl) => {
                main.updateProfile(main.auth.currentUser, {
                    photoURL: profilePicUrl,
                });
            });
        });
    }

    detailsForm.submitbtn.disabled = true;
    setTimeout(function () {
        detailsForm.submitbtn.disabled = false;
    }, 500);
    const fullname = detailsForm.fullname.value;
    const phoneNumber = detailsForm.phoneNumber.value;
    let phoneRegEx = /^\d+$/;

    if (!phoneRegEx.test(phoneNumber)) {
        alert("Invalid phone number format");
    } else {
        let personalDetails = {
            fullname: fullname,
            phoneNumber: phoneNumber,
            matric: userData.personalDetails.matric,
            email: userData.personalDetails.email,
        };

        let driverDetails = null;

        if (userData.type == "driver") {
            const vehicleColour = detailsForm.vehicleColour.value;
            const plateNumber = detailsForm.plateNumber.value.toUpperCase();
            const vehicleType = detailsForm.vehicleType.value;
            const license = userData.driverDetails.documents.license;
            const matric = userData.driverDetails.documents.matric;

            driverDetails = {
                vehicle: {
                    colour: vehicleColour,
                    plateNumber: plateNumber,
                    type: vehicleType,
                },
                documents: {
                    license: license,
                    matric: matric,
                    //NEED CHANGING
                    paymentQR: "",
                },
            };
        }

        main.updateDoc(main.doc(main.db, "users", main.auth.currentUser.uid), {
            personalDetails: personalDetails,
            driverDetails: driverDetails,
        })
            .then(() => {
                alert("Update Successful");
            })
            .catch((error) => {
                console.log(error.message);
            });
    }
});

//UPLOAD NEW PROFILE PICTURE | REF: https://codepen.io/azazy/pen/EgdXxG
const profilePic = document.querySelector("#file");
profilePic.addEventListener("change", (e) => {
    e.preventDefault();
    profileImg.src = URL.createObjectURL(e.target.files[0]);
});
