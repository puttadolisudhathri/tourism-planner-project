import { useState } from "react";
import "./App.css";

function App() {
  // =========================
  // LOGIN INFORMATION
  // =========================

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "User"
  );

  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || ""
  );

  // =========================
  // DESTINATIONS
  // =========================

  const destinations = [
    {
      name: "Visakhapatnam",
      state: "Andhra Pradesh",
      description:
        "A beautiful coastal city famous for beaches, hills and scenic views.",
      places: [
        "RK Beach",
        "Kailasagiri",
        "Submarine Museum",
        "Yarada Beach",
      ],
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Visakhapatnam%20beach.jpg",
    },

    {
      name: "Hyderabad",
      state: "Telangana",
      description:
        "The city of pearls, famous for Charminar, historic places and delicious food.",
      places: [
        "Charminar",
        "Golconda Fort",
        "Hussain Sagar Lake",
        "Ramoji Film City",
      ],
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Charminar%20in%20Hyderabad%2C%20India.jpg",
    },

    {
      name: "Goa",
      state: "Goa",
      description:
        "A popular destination known for beautiful beaches, nightlife and Portuguese architecture.",
      places: [
        "Baga Beach",
        "Calangute Beach",
        "Basilica of Bom Jesus",
        "Fort Aguada",
      ],
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Goa%20beach%201265473.jpg",
    },

    {
      name: "Ooty",
      state: "Tamil Nadu",
      description:
        "A peaceful hill station famous for tea gardens, mountains and pleasant weather.",
      places: [
        "Ooty Lake",
        "Botanical Garden",
        "Doddabetta Peak",
        "Rose Garden",
      ],
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Ooty%20town%20of%20Tamil%20Nadu%2003.jpg",
    },

    {
      name: "Jaipur",
      state: "Rajasthan",
      description:
        "The Pink City of India, famous for forts, palaces and royal architecture.",
      places: [
        "Hawa Mahal",
        "Amber Fort",
        "City Palace",
        "Jantar Mantar",
      ],
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Jaipur-Hawa-Mahal.jpg",
    },

    {
      name: "Kerala",
      state: "Kerala",
      description:
        "God's Own Country, famous for backwaters, greenery and beautiful landscapes.",
      places: [
        "Alleppey Backwaters",
        "Munnar",
        "Kovalam Beach",
        "Thekkady",
      ],
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Kerala%20back%20waters.jpg",
    },
  ];

  // =========================
  // PLANNER STATES
  // =========================

  const [selectedDestination, setSelectedDestination] = useState(null);

  const [selectedPlaces, setSelectedPlaces] = useState([]);

  const [selectedTravel, setSelectedTravel] = useState(null);

  const [days, setDays] = useState(1);

  const [people, setPeople] = useState(1);

  const [foodCost, setFoodCost] = useState(500);

  const [hotelCost, setHotelCost] = useState(1500);

  const [totalBudget, setTotalBudget] = useState(null);

  // =========================
  // TRAVEL OPTIONS
  // =========================

  const travelOptions = [
    {
      name: "Bus",
      icon: "🚌",
      price: 800,
    },
    {
      name: "Train",
      icon: "🚆",
      price: 1200,
    },
    {
      name: "Flight",
      icon: "✈️",
      price: 4500,
    },
    {
      name: "Car",
      icon: "🚗",
      price: 3000,
    },
  ];

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();
      console.log(data.message);

      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");

      setIsLoggedIn(false);
      setUserName("");
      setUserEmail("");

      alert("You have been logged out.");
      window.location.href = "/login.html";
    } catch (error) {
      console.error("Logout error:", error);
      alert("Unable to connect to the logout API.");
    }
  };

  // =========================
  // SELECT DESTINATION
  // =========================

  const handleDestinationSelect = (destination) => {
    setSelectedDestination(destination);
    setSelectedPlaces([]);
    setSelectedTravel(null);
    setTotalBudget(null);

    setTimeout(() => {
      document
        .getElementById("planner")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // =========================
  // SELECT PLACES
  // =========================

  const handlePlaceChange = (place) => {
    if (selectedPlaces.includes(place)) {
      setSelectedPlaces(
        selectedPlaces.filter(
          (selectedPlace) => selectedPlace !== place
        )
      );
    } else {
      setSelectedPlaces([...selectedPlaces, place]);
    }
  };

  // =========================
  // CALCULATE BUDGET
  // =========================

  const calculateBudget = () => {
    if (!selectedDestination) {
      alert("Please select a destination first.");
      return;
    }

    if (!selectedTravel) {
      alert("Please select a travel option.");
      return;
    }

    const travel =
      Number(selectedTravel.price) * Number(people);

    const hotel =
      Number(hotelCost) * Number(days);

    const food =
      Number(foodCost) *
      Number(people) *
      Number(days);

    const total = travel + hotel + food;

    setTotalBudget(total);

    setTimeout(() => {
      document
        .getElementById("budget")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // =========================
  // RESET
  // =========================

  const resetPlanner = () => {
    setSelectedDestination(null);
    setSelectedPlaces([]);
    setSelectedTravel(null);
    setDays(1);
    setPeople(1);
    setFoodCost(500);
    setHotelCost(1500);
    setTotalBudget(null);
  };

  // =========================
  // LOGIN CHECK
  // =========================

  if (!isLoggedIn) {
    window.location.href = "/login.html";
    return null;
  }

  // =========================
  // MAIN APPLICATION
  // =========================

  return (
    <div>

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
        <div className="container">

          <a
            className="navbar-brand fw-bold"
            href="#home"
          >
            🌍 Tourism Planner
          </a>

          <div className="navbar-nav ms-auto">

            <a
              className="nav-link"
              href="#home"
            >
              Home
            </a>

            <a
              className="nav-link"
              href="#destinations"
            >
              Destinations
            </a>

            <a
              className="nav-link"
              href="#planner"
            >
              Planner
            </a>

            <a
              className="nav-link"
              href="#budget"
            >
              Budget
            </a>

            <a
              className="nav-link"
              href="#profile"
            >
              👤 Profile
            </a>

            <button
              className="btn btn-link nav-link text-white"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        </div>
      </nav>


      {/* =========================
          HERO
      ========================= */}

      <section
        id="home"
        className="hero-section text-center"
      >
        <div className="container">

          <h1 className="display-4">
            Plan Your Perfect Trip
          </h1>

          <p className="lead">
            Discover beautiful destinations, choose
            your travel options, create your itinerary
            and calculate your trip budget easily.
          </p>

          <a
            href="#destinations"
            className="btn btn-light btn-lg"
          >
            Explore Destinations
          </a>

        </div>
      </section>


      {/* =========================
          DESTINATIONS
      ========================= */}

      <section
        id="destinations"
        className="py-5"
      >
        <div className="container">

          <div className="text-center mb-5">

            <h2>
              Popular Destinations
            </h2>

            <p className="text-muted">
              Choose a destination to start
              planning your trip.
            </p>

          </div>


          <div className="row g-4">

            {destinations.map((destination) => (

              <div
                className="col-md-6 col-lg-4"
                key={destination.name}
              >

                <div
                  className="card destination-card shadow h-100"
                >

                  {/* DESTINATION IMAGE */}

                  <div className="destination-image-container">

                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="destination-image"
                    />

                  </div>


                  {/* DESTINATION DETAILS */}

                  <div className="card-body">

                    <h3 className="card-title">
                      {destination.name}
                    </h3>

                    <p className="text-muted">
                      {destination.state}
                    </p>

                    <p className="card-text">
                      {destination.description}
                    </p>

                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        handleDestinationSelect(
                          destination
                        )
                      }
                    >
                      Select Destination
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>
      </section>


      {/* =========================
          PLANNER
      ========================= */}

      <section
        id="planner"
        className="planner-section py-5"
      >

        <div className="container">

          <div className="text-center mb-5">

            <h2>
              Trip Planner
            </h2>

            <p className="text-muted">
              Plan your destination, places,
              travel and stay.
            </p>

          </div>


          {!selectedDestination ? (

            <div className="alert alert-info text-center">

              Please select a destination from
              the section above.

            </div>

          ) : (

            <div className="row g-4">

              {/* SELECTED DESTINATION */}

              <div className="col-lg-6">

                <div className="card shadow p-4 h-100">

                  <h4>
                    📍 {selectedDestination.name}
                  </h4>

                  <p className="text-muted">
                    {selectedDestination.state}
                  </p>

                  <hr />

                  <h5>
                    Select Tourist Places
                  </h5>


                  {selectedDestination.places.map(
                    (place) => (

                      <div
                        className="form-check mb-2"
                        key={place}
                      >

                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={place}
                          checked={selectedPlaces.includes(
                            place
                          )}
                          onChange={() =>
                            handlePlaceChange(
                              place
                            )
                          }
                        />

                        <label
                          className="form-check-label"
                          htmlFor={place}
                        >
                          {place}
                        </label>

                      </div>

                    )
                  )}

                </div>

              </div>


              {/* TRAVEL OPTIONS */}

              <div className="col-lg-6">

                <div className="card shadow p-4 h-100">

                  <h4>
                    Choose Travel Option
                  </h4>


                  <div className="mt-3">

                    {travelOptions.map(
                      (option) => (

                        <div
                          key={option.name}
                          className={`travel-option ${
                            selectedTravel?.name ===
                            option.name
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedTravel(
                              option
                            )
                          }
                        >

                          <div>

                            <strong>
                              {option.icon}{" "}
                              {option.name}
                            </strong>

                          </div>

                          <div>
                            ₹{option.price} / person
                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>


              {/* TRIP DETAILS */}

              <div className="col-12">

                <div className="card shadow p-4">

                  <h4 className="mb-4">
                    Trip Details
                  </h4>


                  <div className="row g-3">

                    <div className="col-md-3">

                      <label className="form-label">
                        Number of Days
                      </label>

                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        value={days}
                        onChange={(e) =>
                          setDays(e.target.value)
                        }
                      />

                    </div>


                    <div className="col-md-3">

                      <label className="form-label">
                        Number of People
                      </label>

                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        value={people}
                        onChange={(e) =>
                          setPeople(e.target.value)
                        }
                      />

                    </div>


                    <div className="col-md-3">

                      <label className="form-label">
                        Food Cost / Person / Day
                      </label>

                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        value={foodCost}
                        onChange={(e) =>
                          setFoodCost(e.target.value)
                        }
                      />

                    </div>


                    <div className="col-md-3">

                      <label className="form-label">
                        Hotel Cost / Day
                      </label>

                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        value={hotelCost}
                        onChange={(e) =>
                          setHotelCost(e.target.value)
                        }
                      />

                    </div>

                  </div>

                </div>

              </div>


              {/* ITINERARY */}

              <div className="col-12">

                <div className="card shadow p-4">

                  <h4>
                    🗓️ Itinerary
                  </h4>


                  {selectedPlaces.length === 0 ? (

                    <p className="text-muted mt-3">
                      Select tourist places above
                      to create your itinerary.
                    </p>

                  ) : (

                    <div className="mt-3">

                      {selectedPlaces.map(
                        (place, index) => (

                          <div
                            className="itinerary-item"
                            key={place}
                          >

                            <strong>
                              Day {index + 1}:
                            </strong>{" "}

                            Visit {place}

                          </div>

                        )
                      )}

                    </div>

                  )}

                </div>

              </div>


              {/* BUTTONS */}

              <div className="col-12 text-center">

                <button
                  className="btn btn-primary btn-lg me-2"
                  onClick={calculateBudget}
                >
                  Calculate Budget
                </button>


                <button
                  className="btn btn-secondary btn-lg"
                  onClick={resetPlanner}
                >
                  Reset
                </button>

              </div>

            </div>

          )}

        </div>

      </section>


      {/* =========================
          BUDGET
      ========================= */}

      <section
        id="budget"
        className="py-5"
      >

        <div className="container">

          <div className="text-center mb-4">

            <h2>
              💰 Budget Calculator
            </h2>

          </div>


          {totalBudget === null ? (

            <div className="alert alert-info text-center">

              Your calculated budget will
              appear here.

            </div>

          ) : (

            <div className="budget-card shadow">

              <h4>
                Estimated Trip Budget
              </h4>

              <h1 className="text-primary my-4">

                ₹
                {totalBudget.toLocaleString(
                  "en-IN"
                )}

              </h1>


              <p>
                Destination:{" "}
                <strong>
                  {selectedDestination?.name}
                </strong>
              </p>


              <p>
                People:{" "}
                <strong>
                  {people}
                </strong>
              </p>


              <p>
                Days:{" "}
                <strong>
                  {days}
                </strong>
              </p>


              <p>
                Travel:{" "}
                <strong>
                  {selectedTravel?.name}
                </strong>
              </p>

            </div>

          )}

        </div>

      </section>


      {/* =========================
          PROFILE
      ========================= */}

      <section
        id="profile"
        className="py-5 bg-light"
      >

        <div className="container">

          <div
            className="card shadow p-4 mx-auto text-center"
            style={{ maxWidth: "600px" }}
          >

            <h2>
              👤 Profile
            </h2>

            <hr />

            <p>
              <strong>Name:</strong>{" "}
              {userName}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {userEmail}
            </p>


            <button
              className="btn btn-danger"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>

      </section>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="bg-dark text-white text-center py-4">

        <p className="mb-0">
          © 2026 Tourism Planner.
          All Rights Reserved.
        </p>

      </footer>

    </div>
  );
}

export default App;