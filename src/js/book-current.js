////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");
let userData;
let currentBooking;
const bookingStatus = document.querySelector("#bookingStatus");

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

    const rendererOptions = {
        map: map,
        suppressMarkers: false,
    };
    let directionDisplay = new DirectionsRenderer(rendererOptions);
    ///////////////////////////////////////////////////////////////////////////// END GOOGLE MAP SETTINGS
    const cancelbtn = document.querySelector("#cancelbtn");
    const driverDetails = document.querySelector("#driverDetails");

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
                }
            });

            //CHECK IF THE CURRENT USER HAVE AN ACTIVE BOOKING
            const q = main.query(main.bookingDB, main.where("passengerId", "==", user.uid), main.where("status", "in", ["waiting", "ongoing"]));
            const contactbtn = document.querySelector("#contactbtn");

            main.onSnapshot(q, (snapshot) => {
                if (!snapshot.empty) {
                    let bookingQuery = [];
                    snapshot.docs.forEach((doc) => {
                        bookingQuery.push({ ...doc.data(), id: doc.id });
                    });

                    currentBooking = bookingQuery[0];

                    const bookingDetails = document.querySelector("#bookingDetails");
                    const bookingIdView = document.querySelector("#bookingId");

                    bookingIdView.innerText = "#" + currentBooking.id;
                    bookingDetails.from.value = currentBooking.from;
                    bookingDetails.to.value = currentBooking.destination;
                    bookingDetails.person.value = currentBooking.person;
                    bookingDetails.datetime.value = currentBooking.datetime;
                    bookingDetails.notes.value = currentBooking.notes;
                    bookingStatus.status.value = currentBooking.status.toUpperCase();
                    bookingStatus.price.value = currentBooking.price;

                    getRoute(currentBooking.from, currentBooking.destination);
                    //IF CURRENT STATUS IS ONGOING, DISABLE CANCEL BUTTON
                    if (currentBooking.status == "ongoing") {
                        main.getDoc(main.doc(main.db, "users", currentBooking.driverId)).then((doc) => {
                            driverData = doc.data();
                            let phoneNumber = "+6" + driverData.personalDetails.phoneNumber;
                            let contactLink = "https://wa.me/" + phoneNumber;
                            contactbtn.href = contactLink;

                            bookingStatus.driverName.value = driverData.personalDetails.fullname;
                            bookingStatus.vehicle.value = driverData.driverDetails.vehicle.colour + " " + driverData.driverDetails.vehicle.type;
                            bookingStatus.plateNumber.value = driverData.driverDetails.vehicle.plateNumber;
                        });
                        cancelbtn.style.display = "none";
                        driverDetails.style.display = "block";
                    } else {
                        cancelbtn.style.display = "block";
                        driverDetails.style.display = "none";
                    }
                } else {
                    setTimeout(function () {
                        window.location.href = "/book-ride.html";
                    }, 500);
                }
            });

            //CHECK IF THE CURRENT DRIVER HAVE AN ACTIVE BOOKING
            const q2 = main.query(main.bookingDB, main.where("driverId", "==", user.uid), main.where("status", "==", "ongoing"));
            main.onSnapshot(q2, (snapshot) => {
                if (!snapshot.empty) {
                    setTimeout(function () {
                        //go to current booking driver page
                        window.location.href = "/driver-book.html";
                    }, 500);
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
                status: "cancelled",
            });
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
        let request = {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
        };

        directionService.route(request, (result, status) => {
            if (status == google.maps.DirectionsStatus.OK) {
                directionDisplay.setDirections(result);
            } else {
                directionDisplay.setDirections({ routes: [] });
                map.setCenter(center);
                map.setZoom(zoom);
                alert("Invalid addresses");
            }
        });
    }
});
