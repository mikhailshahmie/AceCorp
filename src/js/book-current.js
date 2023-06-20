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
    let directionDisplay = new DirectionsRenderer();
    directionDisplay.setMap(map);
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
            main.onSnapshot(q, (snapshot) => {
                if (!snapshot.empty) {
                    let bookingQuery = [];
                    snapshot.docs.forEach((doc) => {
                        bookingQuery.push({ ...doc.data(), id: doc.id });
                    });

                    currentBooking = bookingQuery[0];

                    const bookingDetails = document.querySelector("#bookingDetails");

                    bookingDetails.from.value = currentBooking.from;
                    bookingDetails.to.value = currentBooking.destination;
                    bookingDetails.person.value = currentBooking.person;
                    bookingDetails.datetime.value = currentBooking.datetime;
                    bookingDetails.notes.value = currentBooking.notes;
                    bookingStatus.status.value = currentBooking.status.toUpperCase();

                    getRoute(currentBooking.from, currentBooking.destination);
                    //IF CURRENT STATUS IS ONGOING, DISABLE CANCEL BUTTON
                    if (currentBooking.status == "ongoing") {
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
                let distance = result.routes[0].legs[0].distance;
                let minPrice = ((distance.value / 1000) * 1).toFixed();
                let maxPrice = ((distance.value / 1000) * 1 + 4).toFixed();
                let estimatePrice = "RM " + minPrice + "  ~ RM " + maxPrice;

                bookingStatus.price.value = estimatePrice;
                console.log(estimatePrice);
            } else {
                directionDisplay.setDirections({ routes: [] });
                map.setCenter(center);
                map.setZoom(zoom);
                alert("Invalid addresses");
            }
        });
    }
});
