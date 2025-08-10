const apiKey = "DEMO_KEY"; // Replace with your NASA API key
const fetchBtn = document.getElementById("fetch-btn");
const dateInput = document.getElementById("apod-date");
const loader = document.getElementById("loader");

const today = new Date().toISOString().split("T")[0];
dateInput.max = today;
dateInput.min = "1995-06-16";

// Set default date to today
dateInput.value = today;

function getAPOD(date) {
    let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
    if (date) url += `&date=${date}`;

    showLoader(true);

    fetch(url)
        .then(response => {
            // Even if not OK, still try parsing JSON to show NASA's error message
            return response.json();
        })
        .then(data => {
            if (data.code) { 
                // NASA sends "code" field when there's an error
                throw new Error(data.msg || "No APOD found for this date.");
            }

            document.getElementById("title").textContent = data.title || "No Title";
            document.getElementById("date").textContent = data.date || "";
            document.getElementById("explanation").textContent = data.explanation || "No explanation available.";

            if (data.media_type === "image") {
                document.getElementById("image").src = data.url;
                document.getElementById("image").style.display = "block";
                document.getElementById("video").style.display = "none";
            } else if (data.media_type === "video") {
                document.getElementById("video").src = data.url;
                document.getElementById("video").style.display = "block";
                document.getElementById("image").style.display = "none";
            } else {
                document.getElementById("image").style.display = "none";
                document.getElementById("video").style.display = "none";
            }
        })
        .catch(error => {
            document.getElementById("title").textContent = "No APOD Available";
            document.getElementById("date").textContent = date;
            document.getElementById("explanation").textContent = error.message;
            document.getElementById("image").style.display = "none";
            document.getElementById("video").style.display = "none";
        })
        .finally(() => showLoader(false));
}

function showLoader(show) {
    loader.style.display = show ? "block" : "none";
}

// Load APOD for today on page load
getAPOD(today);

fetchBtn.addEventListener("click", () => {
    const selectedDate = dateInput.value;
    if (selectedDate) {
        getAPOD(selectedDate);
    } else {
        alert("Please select a date first!");
    }
});
