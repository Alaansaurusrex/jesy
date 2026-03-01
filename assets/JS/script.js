
const apiKey = "7300f1c6d8c6f2ac64bfa4f3f1bf3060"; // RECUERDA PONER TU KEY AQUÍ

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

searchBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim();

    if (!city) {
        alert("¡Ups! Olvidaste escribir el nombre de una ciudad.");
        return;
    }

    try {
        const response_geocode = await fetch(
            `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
        );
        const geocodeData = await response_geocode.json();
        const { lat, lon } = geocodeData[0];

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`,
        );

        if (!response.ok) {
            throw new Error("Ciudad no encontrada");
        }

        const data = await response.json();

        // Mostrar tarjeta con animación
        const card = document.getElementById("weatherCard");
        card.classList.remove("d-none");

        document.getElementById("cityName").textContent = `📍 ${data.name}, ${data.sys.country}`;
        document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById("description").textContent = data.weather[0].description;
        document.getElementById("humidity").textContent = `${data.main.humidity}%`;
        document.getElementById("windSpeed").textContent = `${data.wind.speed} m/s`;

        // Icono dinámico según el clima
        const iconDiv = document.getElementById("weatherIcon");
        const mainWeather = data.weather[0].main.toLowerCase();

        if (mainWeather.includes("cloud")) iconDiv.innerHTML = '<i class="fa-solid fa-cloud"></i>';
        else if (mainWeather.includes("rain")) iconDiv.innerHTML = '<i class="fa-solid fa-cloud-showers-heavy"></i>';
        else if (mainWeather.includes("clear")) iconDiv.innerHTML = '<i class="fa-solid fa-sun"></i>';
        else iconDiv.innerHTML = '<i class="fa-solid fa-smog"></i>';

        // Recomendaciones mejoradas
        let rec = "";
        let temp = data.main.temp;

        if (temp > 30) {
            rec = "¡Hace calor! Usa ropa ligera, bebe mucha agua y no olvides tu protector solar. 🧴☀️";
        } else if (temp < 15) {
            rec = "¡Está fresquito! Abrígate bien y disfruta de una bebida calientita. ☕🧤";
        } else {
            rec = "¡El clima está perfecto! Ideal para ir al parque o andar en bici. 🚲🌳";
        }

        document.getElementById("recommendation").textContent = rec;

    } catch (error) {
        alert("No pudimos encontrar esa ciudad. ¡Intenta con otra! 🌍");
    }
});

// Permitir buscar con la tecla "Enter"
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchBtn.click();
});