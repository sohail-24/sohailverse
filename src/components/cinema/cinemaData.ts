import type { Movie } from "../../lib/api";

export interface GenreItem {
  id: string;
  name: string;
  image: string;
  tagline: string;
  color: string;
}

export const CURATED_GENRES: GenreItem[] = [
  {
    id: "action",
    name: "Action",
    image: "/cinema/genres/action.jpg",
    tagline: "Kinetic rhythm & daring journeys",
    color: "from-amber-500/20 to-rose-500/20",
  },
  {
    id: "scifi",
    name: "Sci-Fi",
    image: "/cinema/genres/scifi.jpg",
    tagline: "Cosmic depths & speculative futures",
    color: "from-cyan-500/20 to-blue-600/20",
  },
  {
    id: "adventure",
    name: "Adventure",
    image: "/cinema/genres/adventure.jpg",
    tagline: "Untamed frontiers & epic quests",
    color: "from-emerald-500/20 to-teal-600/20",
  },
  {
    id: "thriller",
    name: "Thriller",
    image: "/cinema/genres/thriller.jpg",
    tagline: "Pulsing suspense & nocturnal enigmas",
    color: "from-indigo-500/20 to-purple-600/20",
  },
  {
    id: "comedy",
    name: "Comedy",
    image: "/cinema/genres/comedy.jpg",
    tagline: "Warm wit & golden laughter",
    color: "from-yellow-500/20 to-orange-500/20",
  },
  {
    id: "drama",
    name: "Drama",
    image: "/cinema/genres/drama.jpg",
    tagline: "The raw poetry of human truth",
    color: "from-blue-500/20 to-slate-600/20",
  },
];

// Curated poster library for cinematic presentation fallback
export const POSTER_POOL = [
  "/cinema/posters/interstellar.jpg",
  "/cinema/posters/inception.jpg",
  "/cinema/posters/dark-knight.jpg",
  "/cinema/posters/shawshank.jpg",
  "/cinema/posters/endgame.jpg",
  "/cinema/posters/your-name.jpg",
  "/cinema/posters/blade-runner.jpg",
  "/cinema/posters/matrix.jpg",
  "/cinema/posters/oppenheimer.jpg",
];

/**
 * Resolves movie presentation metadata directly from the live Movie record
 * without any hardcoded movie dictionary.
 */
export function getMovieEditorial(movie: Movie, index: number = 0) {
  const fallbackPoster = POSTER_POOL[index % POSTER_POOL.length];
  const poster = movie.poster_url || fallbackPoster;
  const description =
    movie.synopsis ||
    `Curated as part of Sohail's personal cinema collection, exploring ${movie.genre || "cinema"} storytelling.`;
  const rating = movie.rating != null ? Number(movie.rating) : 5;
  const movieUrl = movie.movie_url || movie.trailer_url || "";

  return {
    id: movie.id,
    title: movie.title,
    rawTitle: movie.title,
    genre: movie.genre || "General",
    rawGenre: movie.genre || "General",
    rating,
    trailerUrl: movieUrl,
    movieUrl,
    poster,
    tagline: description,
    description,
    isFeatured: Boolean(movie.is_featured),
  };
}

/**
 * Parses a YouTube video ID from various YouTube URL formats.
 */
export function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=1&rel=0&modestbranding=1`;
    }
  } catch (e) {
    // Ignore URL parse failures
  }
  return null;
}
