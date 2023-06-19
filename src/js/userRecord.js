////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");

const q = main.query(main.usersDB);
main.getDocs(q).then((snapshot) => {
  let userT = [];
  const userTable = document.querySelector("#userTable");
  if (!snapshot.empty) {
    snapshot.forEach((doc) => {
      userT.push({ ...doc.data(), userId: doc.id });
    });

    const filterDropdown = document.querySelector("#Filter");
    filterDropdown.addEventListener("change", handleFilterChange);

    function handleFilterChange() {
      const selectedValue = filterDropdown.value;
      const filteredUsers = userT.filter((user) => user.type === selectedValue || selectedValue === "all");

      userTable.innerHTML = `
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Matric Number</th>
              <th>Email</th>
              <th>Phone Number</th>
              ${selectedValue === "driver" ? `<th>Vehicle Color</th><th>Vehicle Type</th><th>Plate Number</th>` : ""}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filteredUsers
              .map((user) => `
                <tr class="${user.userId}">
                  <td>${user.personalDetails.fullname}</td>
                  <td><span class="editable" data-field="matric">${user.personalDetails.matric}</span></td>
                  <td><span class="editable" data-field="email">${user.personalDetails.email}</span></td>
                  <td>${user.personalDetails.phoneNumber}</td>
                  ${selectedValue === "driver" && user.driverDetails && user.driverDetails.vehicle ? `
                    <td>${user.driverDetails.vehicle.colour}</td>
                    <td>${user.driverDetails.vehicle.type}</td>
                    <td>${user.driverDetails.vehicle.plateNumber}</td>
                  ` : ""}
                  <td><button class="updateBtn">Update</button></td>
                </tr>
              `)
              .join("")}
          </tbody>
        </table>
      `;

      // Add event listeners to editable fields
      const editableFields = document.querySelectorAll(".editable");
      editableFields.forEach((field) => {
        field.addEventListener("click", handleFieldClick);
      });

      // Add event listeners to update buttons
      const updateButtons = document.querySelectorAll(".updateBtn");
      updateButtons.forEach((button) => {
        button.addEventListener("click", handleUpdateButtonClick);
      });
    }

    function handleFieldClick(event) {
      event.target.contentEditable = true;
      event.target.focus();
    }

    function handleUpdateButtonClick(event) {
      const userId = event.target.closest("tr").classList[0];
      const editableFields = event.target.closest("tr").querySelectorAll(".editable");

      editableFields.forEach((field) => {
        field.contentEditable = false;
        const updatedValue = field.innerText.trim();
        const fieldName = field.getAttribute("data-field");

        // Update the user's data in the database
        main.updateDoc(main.usersDB, userId, fieldName, updatedValue).then(() => {
          console.log(`User ${userId} ${fieldName} updated to ${updatedValue}`);
        }).catch((error) => {
          console.error(`Error updating user ${userId} ${fieldName}:`, error);
        });
      });
    }

    // Initial rendering
    handleFilterChange();
  }
});
