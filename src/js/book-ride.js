////////////////////////////MUST HAVE////////////////////////////
const { connectStorageEmulator } = require("firebase/storage");
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
        window.location.href = "/signin.html";
    }
});
/////////////////////////////////////////////////////////////////

const bookingForm = document.querySelector("#bookingForm");
//SET MINIMUM DATE FOR BOOKING
const today = new Date().toISOString().slice(0, 16);
bookingForm.datetime.min = today;

//GOOGLE MAP SETTINGS
main.loader.load().then(async () => {
    const { Map } = await google.maps.importLibrary("maps");
    const { Autocomplete } = await google.maps.importLibrary("places");
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

    const autoCompleteOptions = {
        bounds: defaultBounds,
        componentRestrictions: { country: "my" },
        fields: ["address_components", "geometry", "icon", "name"],
        strictBounds: false,
    };

    let map = new Map(document.getElementById("googlemap"), mapOptions);
    let originAutocomplete = new Autocomplete(bookingForm.from, autoCompleteOptions);
    let destinationAutocomplete = new Autocomplete(bookingForm.to, autoCompleteOptions);
    let directionService = new DirectionsService();
    let directionDisplay = new DirectionsRenderer();
    directionDisplay.setMap(map);
    ///////////////////////////////////////////////////////////////////////////// END GOOGLE MAP SETTINGS
    // originAutocomplete.addListener("place_changed", getRoute);
    // destinationAutocomplete.addListener("place_changed", getRoute);

    bookingForm.from.addEventListener("focusout", (e) => {
        e.preventDefault();
        getRoute();
    });

    bookingForm.to.addEventListener("focusout", (e) => {
        e.preventDefault();
        getRoute();
    });

    //SUBMIT BOOKING FORM
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
    function getRoute() {
        if (bookingForm.from.value == "" || bookingForm.to.value == "") {
        } else {
            let request = {
                origin: bookingForm.from.value,
                destination: bookingForm.to.value,
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.IMPERIAL,
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
    }
});
