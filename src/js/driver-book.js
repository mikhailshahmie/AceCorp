////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");
let userData;
let currentBooking;
var img = document.getElementById("qrImg");

//GOOGLE MAP SETTINGS
main.loader.load().then(async () => {
    const { Map } = await google.maps.importLibrary("maps");
    const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary("routes");

    const center = { lat: 1.5599088383894277, lng: 103.63763485706686 };
    const zoom = 14;

    const mapOptions = {
        center: center,
        zoom: zoom,
        disableDefaultUI: true,
        // gestureHandling: "none",
        // zoomControl: false,
    };

    const defaultBounds = {
        north: center.lat + 0.1,
        south: center.lat - 0.1,
        east: center.lng + 0.1,
        west: center.lng - 0.1,
    };

    let map = new Map(document.getElementById("currentgooglemap"), mapOptions);
    let directionService = new DirectionsService();
    let directionDisplay = new DirectionsRenderer();
    directionDisplay.setMap(map);
    ///////////////////////////////////////////////////////////////////////////// END GOOGLE MAP SETTINGS
    const cancelbtn = document.querySelector("#cancelbtn");
    const settlebtn = document.querySelector("#settlebtn");

    main.onAuthStateChanged(main.auth, (user) => {
        if (user) {
            let emailRegEx = /[^ ]@graduate.utm.my\i*$/;
            if (!emailRegEx.test(user.email)) {
                window.location.href = "/adminmain.html";
            }
            main.getDoc(main.doc(main.db, "users", user.uid)).then((doc) => {
                userData = doc.data();
                const redirectBtn = document.querySelector("#redirect");
                const driverBookhistory = document.querySelector("#driverBookhistory");

                if (userData.type == "passenger") {
                    redirectBtn.href = "driver-application.html";
                    redirectBtn.text = "Be a Driver";
                    driverBookhistory.style.display = "none";
                } else if (userData.type == "driver") {
                    //NEED CHANGING
                    driverBookhistory.style.display = "block";
                    redirectBtn.href = "driver-home.html";
                    redirectBtn.text = "Driver dashboard";

                    //CHECK IF THE CURRENT DRIVER HAVE AN ACTIVE BOOKING
                    const q = main.query(main.bookingDB, main.where("driverId", "==", user.uid), main.where("status", "==", "ongoing"));
                    main.onSnapshot(q, (snapshot) => {
                        if (!snapshot.empty) {
                            let bookingQuery = [];
                            snapshot.docs.forEach((doc) => {
                                bookingQuery.push({ ...doc.data(), id: doc.id });
                            });

                            currentBooking = bookingQuery[0];

                            const bookingDetails = document.querySelector("#bookingDetails");
                            const bookingStatus = document.querySelector("#bookingStatus");
                            const bookingIdView = document.querySelector("#bookingId");
                            getRoute(currentBooking.from, currentBooking.destination);

                            bookingIdView.innerText = "#" + currentBooking.id;
                            bookingDetails.from.value = currentBooking.from;
                            bookingDetails.to.value = currentBooking.destination;
                            bookingDetails.person.value = currentBooking.person;
                            bookingDetails.datetime.value = currentBooking.datetime;
                            bookingDetails.notes.value = currentBooking.notes;
                            bookingStatus.status.value = currentBooking.status.toUpperCase();
                            bookingStatus.price.value = currentBooking.price;
                            img.src = userData.driverDetails.documents.paymentQR;

                            main.getDoc;
                        } else {
                            setTimeout(function () {
                                window.location.href = "/driver-home.html";
                            }, 500);
                        }
                    });
                }
            });
        } else {
            window.location.href = "/signin.html";
        }
    });
    /////////////////////////////////////////////////////////////////

    //CANCEL BOOKING
    cancelbtn.addEventListener("click", (e) => {
        e.preventDefault();
        const cancelRef = main.doc(main.db, "bookings", currentBooking.id);
        if (confirm("Are you sure you want to cancel?")) {
            main.updateDoc(cancelRef, {
                driverId: "",
                status: "waiting",
            });
        }
    });

    //SETTLE BOOKING
    settlebtn.addEventListener("click", (e) => {
        e.preventDefault();
        const settleRef = main.doc(main.db, "bookings", currentBooking.id);
        if (confirm("Have the driver paid for the ride?")) {
            if (confirm("Double confirm?")) {
                main.updateDoc(settleRef, {
                    status: "completed",
                });
            }
        }
    });

    //LOGOUT
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

    //UPDATE ROUTE WHEN ORIGIN AND DESTINATION ADDRESS IS SUBMITTED
    function getRoute(origin, destination) {
        const durationText = document.querySelector("#duration");

        let request = {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIAL,
        };

        directionService.route(request, (result, status) => {
            if (status == google.maps.DirectionsStatus.OK) {
                directionDisplay.setDirections(result);
                let duration = result.routes[0].legs[0].duration;
                durationText.innerText = duration.text;
            }
        });
    }

    //MODAL FOR QR
    // Get the modal
    var modal = document.getElementById("myModal");
    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var modalImg = document.getElementById("img01");
    img.onclick = function () {
        modal.style.display = "block";
        modalImg.src = this.src;
    };
    // When the user clicks on <span> (x), close the modal
    modal.onclick = function () {
        modal.style.display = "none";
    };
});
