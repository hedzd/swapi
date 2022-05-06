const moviesListElement = document.getElementById("movies_list");
const starshipListElement = document.getElementById("starship_list");
const starshipNameElement = document.getElementById("starship_name");
const starshipName2Element = document.getElementById("starship_name2");
const starshipInfoElement = document.getElementById("starship_info");
const starshipModelElement = document.getElementById("starship_model");
const starshipManufacturerElement = document.getElementById(
	"starship_manufacturer"
);
const starshipCrewElement = document.getElementById("starship_crew");
const starshipPassengersElement = document.getElementById(
	"starship_passengers"
);
const pageElement = document.getElementById("page");
const nextPageElement = document.getElementById("next_page");
const prevPageElement = document.getElementById("prev_page");
const moviesElement = document.getElementById("movies");
const starshipsElement = document.getElementById("starships");
const backElement = document.getElementById("back");

const movies = [4, 5, 6, 1, 2, 3];

const moviesMap = {};

const limit = 4;

let starshipList = [];

/**
 * This function retrieves movies based on `movies` variable
 * and adds them to the `moviesMap` which is basically a cache layer
 * and adds them to the list of movies on the client side
 */
const loadMovies = async () => {
	for (const movie of movies) {
		const data = await fetch(`https://swapi.dev/api/films/${movie}`).then((v) =>
			v.json()
		);

		moviesMap[String(movie)] = data;

		const child = document.createElement("li");

		const childText = document.createElement("span");
		childText.innerText = `${data.title} / ${data.episode_id} / ${data.release_date}`;

		const childLink = document.createElement("a");
		childLink.innerText = "Starships";
		childLink.classList.add("link");
		childLink.addEventListener("click", () => {
			loadStarship(data.starships);
		});

		child.append(childText, childLink);

		moviesListElement.appendChild(child);
	}
};

/**
 * This functions retrieves all starships coming from input
 * and the loads the first page of them
 * @param starships
 */
const loadStarship = async (starships) => {
	toggleScreens();
	starshipListElement.replaceChildren();
	starshipList = await Promise.all(
		starships.map((starship) => fetch(starship).then((v) => v.json()))
	);
	loadStarshipPage(1);
};

/**
 * This function loads the starships respecting pagination and also
 * updating the current page
 * @param page
 */
const loadStarshipPage = (page) => {
	starshipListElement.replaceChildren();
	pageElement.innerText = page;

	for (const starship of starshipList.slice(limit * (page - 1), limit * page)) {
		const child = document.createElement("li");
		child.innerText = starship.name;
		child.classList.add("link");
		child.addEventListener("click", () => {
			showStarshipData(starship);
		});

		starshipListElement.appendChild(child);
	}
};

/**
 * This function is used as a click event handler for when user wants to see
 * a starship details (right column)
 * @param data
 */
const showStarshipData = (data) => {
	clearStarshipData();
	starshipNameElement.innerText = data.name;
	starshipName2Element.innerText = data.name;
	starshipModelElement.innerText = data.model;
	starshipManufacturerElement.innerText = data.manufacturer;
	starshipCrewElement.innerText = data.crew;
	starshipPassengersElement.innerText = data.passengers;

	for (const film of data.films) {
		const splitted = film.split("/");
		const id = splitted[splitted.length - 2];

		const child = document.createElement("li");
		child.innerText = moviesMap[id].title;
		starshipInfoElement.appendChild(child);
	}
};

/**
 * This function clears current selected starship data which is beneficial on multiple occasions
 */
const clearStarshipData = () => {
	starshipNameElement.innerText = "";
	starshipName2Element.innerText = "";
	starshipModelElement.innerText = "";
	starshipManufacturerElement.innerText = "";
	starshipCrewElement.innerText = "";
	starshipPassengersElement.innerText = "";
	starshipInfoElement.replaceChildren(
		starshipName2Element,
		starshipModelElement,
		starshipModelElement,
		starshipManufacturerElement,
		starshipCrewElement,
		starshipPassengersElement
	);
};

/**
 * This function toggles between movies and starships screens
 */
const toggleScreens = () => {
	if (moviesElement.classList.contains("in")) {
		moviesElement.classList.remove("in");
		moviesElement.classList.add("out");
		starshipsElement.classList.add("in");
		starshipsElement.classList.remove("out");
	} else {
		starshipsElement.classList.remove("in");
		starshipsElement.classList.add("out");
		moviesElement.classList.add("in");
		moviesElement.classList.remove("out");
	}
};

loadMovies();

/**
 * This handler is responsible for showing next page to the user
 * and also checks if next page is in bound or not
 */
nextPageElement.addEventListener("click", () => {
	const next = Number(pageElement.innerText) + 1;

	if (limit * (next - 1) >= starshipList.length) {
		return;
	}

	loadStarshipPage(next);
});

/**
 * This handler is responsible for showing previous page to the user
 * and also checks if previous is valid or not
 */
prevPageElement.addEventListener("click", () => {
	const prev = Number(pageElement.innerText) - 1;

	if (prev < 1) {
		return;
	}

	loadStarshipPage(prev);
});

/**
 * This handler is responsible for switching back to movies screen
 */
backElement.addEventListener("click", () => {
	toggleScreens();
	clearStarshipData();
	pageElement.innerText = "";
});
