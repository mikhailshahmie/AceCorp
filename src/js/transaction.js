////////////////////////////MUST HAVE////////////////////////////
const main = require("./main.js");

const q = main.query(main.bookingDB);
main.getDocs(q).then((snapshot) => {
    let Trecord = [];
    const TRecordTable = document.querySelector("#TRecordTable");
    if (!snapshot.empty) {
      snapshot.docs.forEach((doc) => {
        Trecord.push({ ...doc.data(), bookingId: doc.id });
      });
      TRecordTable.innerHTML = `
      <table class="table table-bordered">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Origin</th>
              <th>Destination</th>
            </tr>
          </thead>
          <tbody>
            ${Trecord.map((booking) => `
              <tr class="${booking.bookingId}">
                <td>${booking.datetime}</td>
                <td>${booking.status.toUpperCase()}</td>
                <td>${booking.from}</td>
                <td>${booking.destination}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
  });

  