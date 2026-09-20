
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "User"
  );

  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || ""
  );

  const destinations = [
    {
      name: "Visakhapatnam",
      state: "Andhra Pradesh",
      description: "A beautiful coastal city famous for beaches and hills.",
      places: ["RK Beach", "Kailasagiri", "Submarine Museum", "Yarada Beach"],
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Visakhapatnam%20beach.jpg"
    },
    {
      name: "Hyderabad",
      state: "Telangana",
      description: "Famous for Charminar, historical places and delicious food.",
      places: ["Charminar", "Golconda Fort", "Hussain Sagar Lake", "Ramoji Film City"],
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Charminar%20in%20Hyderabad%2C%20India.jpg"
    },
    {
      name: "Goa",
      state: "Goa",
      description: "Popular for beaches and Portuguese architecture.",
      places: ["Baga Beach", "Calangute Beach", "Basilica of Bom Jesus", "Fort Aguada"],
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Goa%20beach%201265473.jpg"
    },
    {
      name: "Ooty",
      state: "Tamil Nadu",
      description: "A peaceful hill station with tea gardens and mountains.",
      places: ["Ooty Lake", "Botanical Garden", "Doddabetta Peak", "Rose Garden"],
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Ooty%20town%20of%20Tamil%20Nadu%2003.jpg"
    },
    {
      name: "Jaipur",
      state: "Rajasthan",
      description: "The Pink City, famous for forts and palaces.",
      places: ["Hawa Mahal", "Amber Fort", "City Palace", "Jantar Mantar"],
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Jaipur-Hawa-Mahal.jpg"
    },
    {
      name: "Kerala",
      state: "Kerala",
      description: "Famous for backwaters, greenery and beautiful landscapes.",
      places: ["Alleppey Backwaters", "Munnar", "Kovalam Beach", "Thekkady"],
      image:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Kerala%20back%20waters.jpg"
    }
  ];

  const travelOptions = [
    { name: "Bus", icon: "🚌", price: 800 },
    { name: "Train", icon: "🚆", price: 1200 },
    { name: "Flight", icon: "✈️", price: 4500 },
    { name: "Car", icon: "🚗", price: 3000 }
  ];

  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [selectedTravel, setSelectedTravel] = useState(null);

  const [days, setDays] = useState(1);
  const [people, setPeople] = useState(1);
  const [foodCost, setFoodCost] = useState(500);
  const [hotelCost, setHotelCost] = useState(1500);
  const [totalBudget, setTotalBudget] = useState(null);

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/reviews`)
      .then((response) => {
        if (!response.ok) throw new Error("Reviews API unavailable");
        return response.json();
      })
      .then((data) => {
        setReviews(Array.isArray(data) ? data : data.reviews || []);
      })
      .catch((error) => console.error("Review loading error:", error));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    setIsLoggedIn(false);
    window.location.href = "/login.html";
  };

  const handleDestinationSelect = (destination) => {
    setSelectedDestination(destination);
    setSelectedPlaces([]);
    setSelectedTravel(null);
    setTotalBudget(null);

    setTimeout(() => {
      document.getElementById("planner")?.scrollIntoView({
        behavior: "smooth"
      });
    }, 100);
  };

  const handlePlaceChange = (place) => {
    setSelectedPlaces((previous) =>
      previous.includes(place)
        ? previous.filter((item) => item !== place)
        : [...previous, place]
    );
  };

  const calculateBudget = () => {
    if (!selectedDestination) {
      alert("Please select a destination first.");
      return;
    }

    if (!selectedTravel) {
      alert("Please select a travel option.");
      return;
    }

    const travel = Number(selectedTravel.price) * Number(people);
    const hotel = Number(hotelCost) * Number(days);
    const food =
      Number(foodCost) * Number(people) * Number(days);

    const total = travel + hotel + food;
    setTotalBudget(total);

    setTimeout(() => {
      document.getElementById("budget")?.scrollIntoView({
        behavior: "smooth"
      });
    }, 100);
  };

  // SAVE TRIP TO MONGODB
  const saveTrip = async () => {
    if (!selectedDestination) {
      alert("Please select a destination first.");
      return;
    }

    if (!selectedTravel) {
      alert("Please select a travel option.");
      return;
    }

    if (totalBudget === null) {
      alert("Please calculate the budget before saving.");
      return;
    }

    setSaveLoading(true);
    setSaveMessage("");

    const tripData = {
      userName,
      userEmail,
      destination: selectedDestination.name,
      touristPlaces: selectedPlaces,
      travelOption: selectedTravel.name,
      days: Number(days),
      people: Number(people),
      foodCostPerPersonPerDay: Number(foodCost),
      hotelCostPerDay: Number(hotelCost),
      transportCost:
        Number(selectedTravel.price) * Number(people),
      otherCost: 0,
      totalBudget: Number(totalBudget),
      itinerary: selectedPlaces.map(
        (place, index) => `Day ${index + 1}: Visit ${place}`
      )
    };

    try {
      const response = await fetch(`${API_URL}/api/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tripData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save trip");
      }

      setSaveMessage("Trip saved successfully in MongoDB.");
      alert("Trip saved successfully!");

      console.log("Saved trip:", data);
    } catch (error) {
      console.error("Save trip error:", error);

      setSaveMessage(`Unable to save trip: ${error.message}`);
      alert(`Unable to save trip: ${error.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const submitReview = async (event) => {
    event.preventDefault();

    if (!reviewComment.trim() && !reviewFeedback.trim()) {
      alert("Please write a review or feedback.");
      return;
    }

    setReviewLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          userEmail,
          destination: selectedDestination?.name || "General",
          rating: Number(reviewRating),
          comment: reviewComment.trim(),
          feedback: reviewFeedback.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit review");
      }

      setReviews((previous) => [
        ...previous,
        data.review || data
      ]);

      setReviewComment("");
      setReviewFeedback("");
      setReviewRating(5);

      alert("Review submitted successfully.");
    } catch (error) {
      console.error("Review submission error:", error);
      alert(`Unable to submit review: ${error.message}`);
    } finally {
      setReviewLoading(false);
    }
  };

  const resetPlanner = () => {
    setSelectedDestination(null);
    setSelectedPlaces([]);
    setSelectedTravel(null);
    setDays(1);
    setPeople(1);
    setFoodCost(500);
    setHotelCost(1500);
    setTotalBudget(null);
    setSaveMessage("");
  };

  if (!isLoggedIn) {
    window.location.href = "/login.html";
    return null;
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#home">
            🌍 Tourism Planner
          </a>

          <div className="navbar-nav ms-auto">
            <a className="nav-link" href="#home">Home</a>
            <a className="nav-link" href="#destinations">Destinations</a>
            <a className="nav-link" href="#planner">Planner</a>
            <a className="nav-link" href="#budget">Budget</a>
            <a className="nav-link" href="#reviews">⭐ Reviews</a>
            <a className="nav-link" href="#profile">👤 Profile</a>

            <button
              className="btn btn-link nav-link text-white"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <section id="home" className="hero-section text-center">
        <div className="container">
          <h1 className="display-4">Plan Your Perfect Trip</h1>
          <p className="lead">
            Discover destinations, choose travel options,
            plan your itinerary and calculate your budget.
          </p>
          <a href="#destinations" className="btn btn-light btn-lg">
            Explore Destinations
          </a>
        </div>
      </section>

      <section id="destinations" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2>Popular Destinations</h2>
            <p className="text-muted">
              Choose a destination to start planning.
            </p>
          </div>

          <div className="row g-4">
            {destinations.map((destination) => (
              <div className="col-md-6 col-lg-4" key={destination.name}>
                <div className="card destination-card shadow h-100">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="destination-image"
                  />

                  <div className="card-body">
                    <h3>{destination.name}</h3>
                    <p className="text-muted">{destination.state}</p>
                    <p>{destination.description}</p>

                    <button
                      className="btn btn-primary"
                      onClick={() => handleDestinationSelect(destination)}
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

      <section id="planner" className="planner-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2>Trip Planner</h2>
            <p className="text-muted">
              Plan your destination, places, travel and stay.
            </p>
          </div>

          {!selectedDestination ? (
            <div className="alert alert-info text-center">
              Please select a destination from above.
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="card shadow p-4 h-100">
                  <h4>📍 {selectedDestination.name}</h4>
                  <p className="text-muted">
                    {selectedDestination.state}
                  </p>

                  <hr />
                  <h5>Select Tourist Places</h5>

                  {selectedDestination.places.map((place) => (
                    <div className="form-check mb-2" key={place}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={place}
                        checked={selectedPlaces.includes(place)}
                        onChange={() => handlePlaceChange(place)}
                      />

                      <label className="form-check-label" htmlFor={place}>
                        {place}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card shadow p-4 h-100">
                  <h4>Choose Travel Option</h4>

                  {travelOptions.map((option) => (
                    <div
                      key={option.name}
                      className={`travel-option ${
                        selectedTravel?.name === option.name
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => setSelectedTravel(option)}
                    >
                      <strong>
                        {option.icon} {option.name}
                      </strong>

                      <span>₹{option.price} / person</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-12">
                <div className="card shadow p-4">
                  <h4>Trip Details</h4>

                  <div className="row g-3">
                    <div className="col-md-3">
                      <label className="form-label">Number of Days</label>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Number of People</label>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        value={people}
                        onChange={(e) => setPeople(e.target.value)}
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
                        onChange={(e) => setFoodCost(e.target.value)}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Hotel Cost / Day</label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        value={hotelCost}
                        onChange={(e) => setHotelCost(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="card shadow p-4">
                  <h4>🗓️ Itinerary</h4>

                  {selectedPlaces.length === 0 ? (
                    <p className="text-muted">
                      Select tourist places to create your itinerary.
                    </p>
                  ) : (
                    selectedPlaces.map((place, index) => (
                      <div className="itinerary-item" key={place}>
                        <strong>Day {index + 1}:</strong> Visit {place}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="col-12 text-center">
                <button
                  className="btn btn-primary btn-lg me-2"
                  onClick={calculateBudget}
                >
                  Calculate Budget
                </button>

                <button
                  className="btn btn-success btn-lg me-2"
                  onClick={saveTrip}
                  disabled={saveLoading}
                >
                  {saveLoading ? "Saving..." : "💾 Save Trip"}
                </button>

                <button
                  className="btn btn-secondary btn-lg"
                  onClick={resetPlanner}
                >
                  Reset
                </button>

                {saveMessage && (
                  <p className="mt-3">{saveMessage}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="budget" className="py-5">
        <div className="container text-center">
          <h2>💰 Budget Calculator</h2>

          {totalBudget === null ? (
            <div className="alert alert-info mt-4">
              Your calculated budget will appear here.
            </div>
          ) : (
            <div className="budget-card shadow mt-4">
              <h4>Estimated Trip Budget</h4>

              <h1 className="text-primary my-4">
                ₹{totalBudget.toLocaleString("en-IN")}
              </h1>

              <p>Destination: {selectedDestination?.name}</p>
              <p>People: {people}</p>
              <p>Days: {days}</p>
              <p>Travel: {selectedTravel?.name}</p>
            </div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2>⭐ Reviews & Ratings</h2>
            <p className="text-muted">
              Share your experience with other travellers.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card shadow p-4">
                <h4>Write a Review</h4>

                <form onSubmit={submitReview}>
                  <label className="form-label">Destination</label>
                  <input
                    className="form-control mb-3"
                    value={selectedDestination?.name || "General"}
                    readOnly
                  />

                  <label className="form-label">Rating</label>
                  <select
                    className="form-select mb-3"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(e.target.value)}
                  >
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option value={rating} key={rating}>
                        {"⭐".repeat(rating)} - {rating}
                      </option>
                    ))}
                  </select>

                  <label className="form-label">Review</label>
                  <textarea
                    className="form-control mb-3"
                    rows="3"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Write your review..."
                  />

                  <label className="form-label">
                    Feedback / Suggestions
                  </label>
                  <textarea
                    className="form-control mb-3"
                    rows="3"
                    value={reviewFeedback}
                    onChange={(e) => setReviewFeedback(e.target.value)}
                    placeholder="Tell us how we can improve..."
                  />

                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={reviewLoading}
                  >
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>

            <div className="col-lg-7">
              {reviews.length === 0 ? (
                <div className="alert alert-info">
                  No reviews available yet.
                </div>
              ) : (
                reviews.map((review, index) => (
                  <div
                    className="card shadow-sm p-3 mb-3"
                    key={review._id || index}
                  >
                    <strong>{review.userName || "Traveller"}</strong>
                    <span>
                      {"⭐".repeat(Number(review.rating) || 0)}
                    </span>
                    <p className="text-muted">
                      {review.destination || "General"}
                    </p>
                    <p>{review.comment || "No review written."}</p>

                    {review.feedback && (
                      <p>
                        <strong>Feedback:</strong> {review.feedback}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="profile" className="py-5 bg-light">
        <div className="container">
          <div className="card shadow p-4 mx-auto text-center"
            style={{ maxWidth: "600px" }}>
            <h2>👤 Profile</h2>
            <hr />
            <p><strong>Name:</strong> {userName}</p>
            <p><strong>Email:</strong> {userEmail}</p>

            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-dark text-white text-center py-4">
        <p className="mb-0">
          © 2026 Tourism Planner. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;