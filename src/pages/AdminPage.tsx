import { useState } from "react";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [message, setMessage] = useState("");

  const addMovie = async () => {
    try {
      const response = await fetch(
        "https://sohailverse-api.sohailkhan88008.workers.dev/api/movies",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            genre,
            rating: Number(rating),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Movie added successfully");
      
        setTitle("");
        setGenre("");
        setRating("");
      } else {
        setMessage("❌ Failed to add movie");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error connecting to API");
    }
  };   
      if (!authenticated) {
        return (
          <PageShell
            eyebrow="Protected Area"
            title="Admin Access"
            description="Enter password to access SohailVerse CMS."
          >
            <GlassPanel className="p-8 max-w-xl">
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border p-3"
              />

              <button
                className="mt-4 rounded-xl bg-black px-4 py-3 text-white"
                onClick={() => {
                  if (password === "sohail@123") {
                    setAuthenticated(true);
                  } else {
                    alert("Wrong Password");
                  }
                }}
              >
                Login
              </button>
            </GlassPanel>
          </PageShell>
        );
      } 

  return (
    <PageShell
      eyebrow="Control Center"
      title="SohailVerse Admin"
      description="Manage movies, travel posts, and academy skills from one place."
    >
      <div className="grid gap-6">

        <GlassPanel className="p-6">
          <h2 className="mb-6 text-2xl font-semibold">
            🎬 Add Movie
          </h2>

          <div className="grid gap-4">

            <input
              type="text"
              placeholder="Movie Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border p-3"
            />

            <input
              type="text"
              placeholder="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="rounded-xl border p-3"
            />

            <input
              type="number"
              step="0.1"
              placeholder="Rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="rounded-xl border p-3"
            />

            <button
              onClick={addMovie}
              className="rounded-xl bg-black px-4 py-3 text-white"
            >
              Add Movie
            </button>

            {message && (
              <p className="font-medium">
                {message}
              </p>
            )}
          </div>
        </GlassPanel>

      </div>
    </PageShell>
  );
}