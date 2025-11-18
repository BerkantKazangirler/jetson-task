fetch("http://localhost:3000/logs")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });
let comboFilter = document.getElementsByClassName("filter-combo")[0];
console.log(comboFilter.value);
var acc = document.getElementsByClassName("data-element");

for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    var accardionData = this.querySelector(".accordion-data");
    var openIcon = this.querySelector(".data-interact-icon");

    if (accardionData.style.display === "flex") {
      accardionData.style.display = "none";
      openIcon.classList.remove("status-open");
    } else {
      openIcon.classList.add("status-open");
      accardionData.style.display = "flex";
    }
  });
}

// const logsContainer = document.getElementById("logs");
//   data.forEach((log) => {
//     const logEntry = document.createElement("div");
//     logEntry.textContent = `[${log.timestamp}] ${log.message}`;
//     logsContainer.appendChild(logEntry);
//   });
