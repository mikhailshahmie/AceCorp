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
        const q = main.query(main.bookingDB, main.where("passengerId", "==", user.uid), main.where("status", "in", ["waiting", "ongoing"]));
        main.getDocs(q).then((snapshot) => {
            let bookingQuery = [];
            snapshot.docs.forEach((doc) => {
                bookingQuery.push({ ...doc.data(), id: doc.id });
            });
            if (bookingQuery.length > 0) {
                //go to current booking page
                window.location.href = "/page.html";
            }
        });
    } else {
    }
});
/////////////////////////////////////////////////////////////////

const bookingForm = document.querySelector("#bookingForm");

//SET MINIMUM DATE FOR BOOKING
const today = new Date().toISOString().slice(0, 16);
bookingForm.datetime.min = today;

bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const submitBtn = bookingForm.submitBtn;

    submitBtn.disabled = true;

    const from = bookingForm.from.value;
    const destination = bookingForm.to.value;
    const person = bookingForm.person.value;
    const datetime = bookingForm.datetime.value.replace("T", " ");
    const notes = bookingForm.notes.value;
    const passengerId = main.auth.currentUser.uid;
    //ADD PRICE VARIABLE HERE

    main.addDoc(main.bookingDB, {
        from: from,
        destination: destination,
        person: person,
        datetime: datetime,
        notes: notes,
        passengerId: passengerId,
        driverId: "",
        preStatus: "",
        price: "",
        status: "waiting",
    })
        .then((success) => {
            alert("Book successfully");
            //go to current booking page
            window.location.href = "/page.html";
        })
        .catch((err) => {
            alert(err.message);
            submitBtn.disabled = false;
        });
});
