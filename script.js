var totalLogs = document.getElementById("logs-value");
var totalUsers = document.getElementById("active-users-value");
var entityTypes = document.getElementById("entity-value");
var searchInput = document.getElementById("search-input");
var comboFilter = document.getElementsByClassName("filter-combo")[0];
var userDatas = [];
var allLogs = [];

fetch("http://localhost:3000/users", { method: "GET" })
  .then((response) => response.json())
  .then((data) => {
    userDatas = data;
  });

function renderLogs() {
  fetch("http://localhost:3000/logs", { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      allLogs = data;
      const dataArea = document.querySelector(".data-area");
      dataArea.innerHTML = "";

      totalLogs.innerText = data.length;
      totalUsers.innerText = userDatas.length;
      entityTypes.innerText = [
        ...new Set(data.map((data) => data.entity_type)),
      ].length;

      let filteredData = data;

      if (searchInput.value.trim() !== "") {
        const searchTerm = searchInput.value.toLowerCase();
        filteredData = filteredData.filter(
          (item) =>
            item.user_name.toLowerCase().includes(searchTerm) ||
            userDatas
              .find((data) => data.id === item.changed_by)
              ?.name.includes(searchTerm)
        );
      }

      if (comboFilter.value !== "ALL") {
        filteredData = data.filter(
          (item) => item.change_type === comboFilter.value
        );
      }

      filteredData.forEach((item) => {
        const dataElement = document.createElement("div");
        dataElement.classList.add("data-element");

        const dataHeader = document.createElement("div");
        dataHeader.classList.add("data-header");
        dataHeader.innerHTML = `
        <svg class="data-interact-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z" fill="currentColor"/>
        </svg>
        <span class="data-type" data-type=${item.change_type}>${item.change_type}</span>
        <span class="data-name">${item.entity_type}</span>
        <span class="data-space">•</span>
        <span class="data-id">ID: ${item.id}</span>
      `;
        dataElement.appendChild(dataHeader);

        const dataDetails = document.createElement("div");
        dataDetails.classList.add("data-details");
        dataDetails.innerHTML = `
        <span class="data-user">Kullanıcı: <span class="data-user-name">${item.user_name}</span></span>
        <span class="data-separator">→</span>
        <span class="data-colmn">Kolon: <span class="data-colmn-name">${item.column_name}</span></span>
      `;
        dataElement.appendChild(dataDetails);

        const dataFooter = document.createElement("div");
        dataFooter.classList.add("data-footer");
        dataFooter.innerHTML = `
        <div class="footer-timestamp">
          <svg class="footer-icon" fill="currentColor" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3,22H21a1,1,0,0,0,1-1V6a1,1,0,0,0-1-1H17V3a1,1,0,0,0-2,0V5H9V3A1,1,0,0,0,7,3V5H3A1,1,0,0,0,2,6V21A1,1,0,0,0,3,22ZM4,7H20v3H4Zm0,5H20v8H4Z"/>
          </svg>
          <p class="data-date">${new Date(item.changed_at).toLocaleString()}</p>
        </div>
        <div class="data-madeby">
          <svg class="madeby-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>    
          <p id="data-madeby">${
            userDatas.find((data) => data.id === item.changed_by)?.name ||
            "Bilinmiyor"
          }</p>
        </div>
      `;
        dataElement.appendChild(dataFooter);

        const accordionData = document.createElement("div");
        accordionData.classList.add("accordion-data");
        accordionData.innerHTML = `
        <div class="changed-value">
          <span>Eski Değer</span>
          <span class="old-data-value">${item.old_value}</span>
        </div>
        <div class="changed-value">
          <span>Yeni Değer</span>
          <span class="new-data-value">${item.new_value}</span>
        </div>
        <div class="changed-value">
          <span>Değişiklik Sebebi</span>
          <span class="new-data-desc">${item.change_reason}</span>
        </div>
        <div class="transaction-details">
          <p class="transaction-title">İşlem Detayları</p>
          <div class="transaction-row">
            <span>Request ID:</span>
            <span class="transaction-data">${item.request_id}</span>
          </div>
          <div class="transaction-row">
            <span>IP Adresi:</span>
            <span class="transaction-data">${item.ip_address}</span>
          </div>
          <div class="transaction-row">
            <span>Değiştiren ID:</span>
            <span class="transaction-data">${item.change_by_id}</span>
          </div>
          <div class="transaction-row">
            <span>Değiştiren:</span>
          <span class="transaction-data">${
            userDatas.find((data) => data.id === item.changed_by)?.name ||
            "Bilinmiyor"
          }</span>
          </div>
        </div>
        <div class="transaction-details">
          <p class="transaction-title">Entity Bilgisi</p>
          <div class="transaction-row">
            <span>Tür:</span>
            <span class="transaction-data">${item.entity_type}</span>
          </div>
          <div class="transaction-row">
            <span>Entity ID:</span>
            <span class="transaction-data">${item.entity_id}</span>
          </div>
          <div class="transaction-row">
            <span>Kolon:</span>
            <span class="transaction-data">${item.column_name}</span>
          </div>
        </div>
      `;
        dataElement.appendChild(accordionData);

        dataArea.appendChild(dataElement);
      });
    });
}

searchInput.addEventListener("input", function () {
  renderLogs();
});

comboFilter.addEventListener("change", function () {
  renderLogs();
});

// Sayfa görünür hale geldiğinde verileri güncelle
document.addEventListener("visibilitychange", function () {
  if (!document.hidden) {
    renderLogs();
  }
});

// Sayfa focus aldığında verileri güncelle
window.addEventListener("focus", function () {
  renderLogs();
});

let dataArea = document.querySelector(".data-area");

dataArea.addEventListener("click", function (event) {
  if (event.target.closest(".data-element")) {
    var dataElement = event.target.closest(".data-element");
    var accardionData = dataElement.querySelector(".accordion-data");
    var openIcon = dataElement.querySelector(".data-interact-icon");

    if (accardionData.style.display === "flex") {
      accardionData.style.display = "none";
      openIcon.classList.remove("status-open");
    } else {
      accardionData.style.display = "flex";
      openIcon.classList.add("status-open");
    }
  }
});
