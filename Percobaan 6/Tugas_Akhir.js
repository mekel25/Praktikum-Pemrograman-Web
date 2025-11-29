const WEATHER_API_KEY = "ffe83d710eb450d9c471aa554dccbf1d";
const BASE_URL_WEATHER = "https://api.openweathermap.org/data/2.5";
const BASE_URL_DB = "http://localhost:3000/favorites";

let state = {
    city: "Bandar Lampung",
    units: "metric",
    currentWeatherData: null
};

const elements = {
    cityInput: document.getElementById("city-input"),
    searchBtn: document.getElementById("search-btn"),
    refreshBtn: document.getElementById("refresh-btn"),
    themeToggle: document.getElementById("theme-toggle"),
    unitToggle: document.getElementById("unit-toggle"),
    loading: document.getElementById("loading-indicator"),

    cityName: document.getElementById("city-name"),
    dateTime: document.getElementById("date-time"),
    temp: document.getElementById("temperature"),
    desc: document.getElementById("weather-desc"),
    icon: document.getElementById("weather-icon"),
    humidity: document.getElementById("humidity"),
    wind: document.getElementById("wind-speed"),
    forecastContainer: document.getElementById("forecast-container"),

    favList: document.getElementById("favorites-list"),
    saveFavBtn: document.getElementById("save-favorite-btn")
};

async function fetchWeather(city) {
    showLoading(true);
    try {
        const res = await fetch(
            `${BASE_URL_WEATHER}/weather?q=${city}&units=${state.units}&appid=${WEATHER_API_KEY}`
        );
        if (!res.ok) throw new Error("Kota tidak ditemukan atau masalah koneksi.");

        const data = await res.json();
        state.currentWeatherData = data;
        state.city = data.name;

        const forecastRes = await fetch(
            `${BASE_URL_WEATHER}/forecast?q=${city}&units=${state.units}&appid=${WEATHER_API_KEY}`
        );
        const forecastData = await forecastRes.json();

        renderCurrentWeather(data);
        renderForecast(forecastData.list);
        checkIfFavorite(data.name);

    } catch (error) {
        alert(`Error: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

function renderCurrentWeather(data) {
    elements.cityName.innerText = `${data.name}, ${data.sys.country}`;
    elements.dateTime.innerText = new Date().toLocaleString("id-ID", {
        dateStyle: "full",
        timeStyle: "short"
    });

    elements.temp.innerText = `${Math.round(data.main.temp)}°`;
    elements.desc.innerText = data.weather[0].description;
    elements.humidity.innerText = data.main.humidity;
    elements.wind.innerText = data.wind.speed;

    const iconCode = data.weather[0].icon;
    elements.icon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    elements.icon.classList.remove("hidden");
}

function renderForecast(list) {
    elements.forecastContainer.innerHTML = "";

    const dailyData = list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString("id-ID", {
            weekday: "short",
            day: "numeric"
        });

        const temp = Math.round(day.main.temp);
        const icon = day.weather[0].icon;

        const card = `
            <div class="forecast-card">
                <p><strong>${date}</strong></p>
                <img src="https://openweathermap.org/img/wn/${icon}.png">
                <p>${temp}°</p>
                <p style="font-size:0.7rem">${day.weather[0].main}</p>
            </div>
        `;
        elements.forecastContainer.innerHTML += card;
    });
}

async function loadFavorites() {
    try {
        const res = await fetch(BASE_URL_DB);
        const favorites = await res.json();
        renderFavoritesList(favorites);
    } catch (error) {
        elements.favList.innerHTML =
            `<p style="color:red;text-align:center;">Gagal koneksi ke database lokal.</p>`;
    }
}

function renderFavoritesList(favorites) {
    elements.favList.innerHTML = "";

    if (favorites.length === 0) {
        elements.favList.innerHTML =
            "<p style='text-align:center;color:gray;'>Belum ada kota favorit.</p>";
        return;
    }

    favorites.forEach(fav => {
        const item = document.createElement("div");
        item.className = "fav-item";

        item.innerHTML = `
            <div class="fav-info">
                <span class="fav-name" onclick="fetchWeather('${fav.name}')">${fav.name}</span>
                <span class="fav-note">Note: ${fav.note}</span>
            </div>
            <div class="fav-actions">
                <button class="btn-action btn-edit" onclick="updateFavorite('${fav.id}', '${fav.note}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-delete" onclick="deleteFavorite('${fav.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        elements.favList.appendChild(item);
    });
}

async function addFavorite() {
    if (!state.currentWeatherData)
        return alert("Cari kota dulu sebelum menyimpan!");

    const res = await fetch(BASE_URL_DB);
    const favorites = await res.json();
    const exists = favorites.find(f => f.name === state.currentWeatherData.name);

    if (exists) return;

    const newFav = {
        name: state.currentWeatherData.name,
        note: "Catatan..."
    };

    await fetch(BASE_URL_DB, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFav)
    });

    updateHeartIcon(true);
    loadFavorites();
}

window.updateFavorite = async function (id, oldNote) {
    const newNote = prompt("Edit catatan kota ini:", oldNote);
    if (newNote === null || newNote === oldNote) return;

    const getRes = await fetch(`${BASE_URL_DB}/${id}`);
    const oldData = await getRes.json();

    await fetch(`${BASE_URL_DB}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...oldData, note: newNote })
    });

    loadFavorites();
};

window.deleteFavorite = async function (id) {
    if (!confirm("Yakin hapus kota ini dari favorit?")) return;

    await fetch(`${BASE_URL_DB}/${id}`, { method: "DELETE" });
    loadFavorites();

    updateHeartIcon(false);
};

async function checkIfFavorite(cityName) {
    const res = await fetch(BASE_URL_DB);
    const favorites = await res.json();
    const found = favorites.find(f => f.name === cityName);

    updateHeartIcon(!!found);
}

function updateHeartIcon(isFav) {
    const icon = elements.saveFavBtn.querySelector("i");

    if (isFav) {
        icon.classList.remove("far");
        icon.classList.add("fas");
        icon.style.color = "#e74c3c";
    } else {
        icon.classList.remove("fas");
        icon.classList.add("far");
        icon.style.color = "#e74c3c";
    }
}

elements.saveFavBtn.addEventListener("click", async () => {
    const res = await fetch(BASE_URL_DB);
    const favorites = await res.json();
    const found = favorites.find(f => f.name === state.city);

    if (found) {
        await deleteFavorite(found.id);
    } else {
        await addFavorite();
    }
});

function showLoading(show) {
    elements.loading.classList.toggle("hidden", !show);
}

elements.searchBtn.addEventListener("click", () => {
    if (elements.cityInput.value)
        fetchWeather(elements.cityInput.value);
});

elements.cityInput.addEventListener("keypress", e => {
    if (e.key === "Enter") elements.searchBtn.click();
});

elements.refreshBtn.addEventListener("click", () => {
    fetchWeather(state.city);
});

elements.themeToggle.addEventListener("click", () => {
    const isDark = document.body.getAttribute("data-theme") === "dark";
    document.body.setAttribute("data-theme", isDark ? "light" : "dark");
});

elements.unitToggle.addEventListener("click", () => {
    state.units = state.units === "metric" ? "imperial" : "metric";
    elements.unitToggle.innerText =
        state.units === "metric" ? "°C / °F" : "°F / °C";
    fetchWeather(state.city);
});

document.addEventListener("DOMContentLoaded", () => {
    fetchWeather("Metro");
    loadFavorites();
});
