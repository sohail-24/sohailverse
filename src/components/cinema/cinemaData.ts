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

// Curated poster library for cinematic presentation
const POSTER_POOL = [
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

// Rich editorial metadata to enrich raw movie records gracefully
const KNOWN_MOVIE_METADATA: Record<
  string,
  {
    displayTitle: string;
    tagline: string;
    poster: string;
    description: string;
    displayGenre: string;
    featuredRating?: number;
  }
> = {
  "harry potter and chamber of secrets": {
    displayTitle: "Harry Potter and the Chamber of Secrets",
    tagline: "Enemies of the heir, beware.",
    poster: "/cinema/featured-favorite.jpg",
    description:
      "An ancient prophecy awakens in the whispering stone walls of Hogwarts as Harry faces the mystery of the legendary chamber.",
    displayGenre: "Fantasy / Adventure",
    featuredRating: 8.8,
  },
  "harry potter and deathly hallows part-1": {
    displayTitle: "Harry Potter & the Deathly Hallows: Part 1",
    tagline: "Nowhere is safe.",
    poster: "/cinema/posters/your-name.jpg",
    description:
      "On the run across a darkened Britain, the trio seeks Voldemort's Horcruxes in the most atmospheric and isolated chapter of the saga.",
    displayGenre: "Fantasy / Drama",
    featuredRating: 8.9,
  },
  "chronicles of narnia lion witch and wardrobe": {
    displayTitle: "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe",
    tagline: "Beyond the wardrobe lies an eternal winter.",
    poster: "/cinema/posters/narnia-lion-witch-wardrobe.jpg",
    description:
      "Four siblings step through a forgotten coat wardrobe into the mythical snowbound land of Narnia, bound by the prophecy of Aslan.",
    displayGenre: "Adventure / Fantasy",
    featuredRating: 8.4,
  },
  "chronicles_of_narnia_lion_witch_and_wardrobe": {
    displayTitle: "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe",
    tagline: "Beyond the wardrobe lies an eternal winter.",
    poster: "/cinema/posters/narnia-lion-witch-wardrobe.jpg",
    description:
      "Four siblings step through a forgotten coat wardrobe into the mythical snowbound land of Narnia, bound by the prophecy of Aslan.",
    displayGenre: "Adventure / Fantasy",
    featuredRating: 8.4,
  },
  "narnia": {
    displayTitle: "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe",
    tagline: "Beyond the wardrobe lies an eternal winter.",
    poster: "/cinema/posters/narnia-lion-witch-wardrobe.jpg",
    description:
      "Four siblings step through a forgotten coat wardrobe into the mythical snowbound land of Narnia, bound by the prophecy of Aslan.",
    displayGenre: "Adventure / Fantasy",
    featuredRating: 8.4,
  },
  "jurassic world 2018": {
    displayTitle: "Jurassic World: Fallen Kingdom",
    tagline: "The park was just the beginning.",
    poster: "/cinema/posters/jurassic-world-fallen-kingdom.jpg",
    description:
      "A race against time to rescue prehistoric marvels from a cataclysmic volcanic eruption before genetic capitalism claims them.",
    displayGenre: "Sci-Fi / Action",
    featuredRating: 7.8,
  },
  "jurassic world fallen kingdom": {
    displayTitle: "Jurassic World: Fallen Kingdom",
    tagline: "The park was just the beginning.",
    poster: "/cinema/posters/jurassic-world-fallen-kingdom.jpg",
    description:
      "A race against time to rescue prehistoric marvels from a cataclysmic volcanic eruption before genetic capitalism claims them.",
    displayGenre: "Sci-Fi / Action",
    featuredRating: 7.8,
  },
  "jurassic park -1": {
    displayTitle: "Jurassic Park",
    tagline: "An adventure 65 million years in the making.",
    poster: "/cinema/posters/dark-knight.jpg",
    description:
      "Steven Spielberg's landmark masterpiece on Isla Nublar combining wonder, ambition, and the untamable majesty of living evolution.",
    displayGenre: "Sci-Fi / Classic",
    featuredRating: 9.3,
  },
  "jurassic world dominion": {
    displayTitle: "Jurassic World Dominion",
    tagline: "The battle for planetary coexistence.",
    poster: "/cinema/posters/endgame.jpg",
    description:
      "Dinosaurs live and hunt alongside humans across the globe in a fragile battle for ecological supremacy.",
    displayGenre: "Action / Sci-Fi",
    featuredRating: 7.5,
  },
  "final destination bloodlines": {
    displayTitle: "Final Destination: Bloodlines",
    tagline: "Death never forgets an interrupted design.",
    poster: "/cinema/posters/final-destination-bloodlines.jpg",
    description:
      "A visceral, inventive continuation of the iconic puzzle where destiny and escape collide through elaborate mechanical fate.",
    displayGenre: "Thriller / Mystery",
    featuredRating: 7.9,
  },
  kgf: {
    displayTitle: "K.G.F: Chapter 1",
    tagline: "The roar that carved an empire in gold.",
    poster: "/cinema/posters/kgf-chapter-1.jpg",
    description:
      "Prashanth Neel's sweeping, high-octane period epic following Rocky's relentless ascent inside the brutal gold mines of Kolar.",
    displayGenre: "Action / Epic",
    featuredRating: 9.1,
  },
  "kgf chapter 1": {
    displayTitle: "K.G.F: Chapter 1",
    tagline: "The roar that carved an empire in gold.",
    poster: "/cinema/posters/kgf-chapter-1.jpg",
    description:
      "Prashanth Neel's sweeping, high-octane period epic following Rocky's relentless ascent inside the brutal gold mines of Kolar.",
    displayGenre: "Action / Epic",
    featuredRating: 9.1,
  },
  "sanam teri kasam": {
    displayTitle: "Sanam Teri Kasam",
    tagline: "A poignant ballad of sacrifice and memory.",
    poster: "/cinema/posters/sanam-teri-kasam.jpg",
    description:
      "A deeply emotional romantic drama exploring sacrifice, unspoken devotion, and memories that outlast fleeting moments.",
    displayGenre: "Romance / Drama",
    featuredRating: 8.2,
  },
  interstellar: {
    displayTitle: "Interstellar",
    tagline: "Beyond our world.",
    poster: "/cinema/posters/interstellar.jpg",
    description:
      "A team of explorers travel through a newly discovered wormhole near Saturn in an attempt to ensure humanity's survival among the stars.",
    displayGenre: "Sci-Fi / Drama",
    featuredRating: 9.5,
  },
  inception: {
    displayTitle: "Inception",
    tagline: "Dream. Plan. Execute.",
    poster: "/cinema/posters/inception.jpg",
    description:
      "A skilled thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into a CEO's subconscious.",
    displayGenre: "Sci-Fi / Thriller",
    featuredRating: 9.2,
  },
  "the dark knight": {
    displayTitle: "The Dark Knight",
    tagline: "Chaos reveals truth.",
    poster: "/cinema/posters/dark-knight.jpg",
    description:
      "Christopher Nolan's towering crime masterpiece where Gotham's soul hangs in the balance between Batman, Harvey Dent, and the Joker.",
    displayGenre: "Action / Crime",
    featuredRating: 9.4,
  },
  "the shawshank redemption": {
    displayTitle: "The Shawshank Redemption",
    tagline: "Hope never dies.",
    poster: "/cinema/posters/shawshank.jpg",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    displayGenre: "Drama / Classic",
    featuredRating: 9.3,
  },
  "avengers: endgame": {
    displayTitle: "Avengers: Endgame",
    tagline: "Whatever it takes.",
    poster: "/cinema/posters/endgame.jpg",
    description:
      "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.",
    displayGenre: "Action / Sci-Fi",
    featuredRating: 8.9,
  },
  "your name": {
    displayTitle: "Your Name",
    tagline: "A timeless connection.",
    poster: "/cinema/posters/your-name.jpg",
    description:
      "Two strangers find themselves linked in a bizarre way. When a connection forms, will distance and time be the only things to keep them apart?",
    displayGenre: "Anime / Fantasy",
    featuredRating: 9.0,
  },
  oppenheimer: {
    displayTitle: "Oppenheimer",
    tagline: "Now I am become Death.",
    poster: "/cinema/posters/oppenheimer.jpg",
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during the Manhattan Project.",
    displayGenre: "Biography / Drama",
    featuredRating: 8.9,
  },
  "the matrix": {
    displayTitle: "The Matrix",
    tagline: "Free your mind.",
    poster: "/cinema/posters/matrix.jpg",
    description:
      "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is an elaborate deception.",
    displayGenre: "Sci-Fi / Cyberpunk",
    featuredRating: 9.0,
  },
  "blade runner 2049": {
    displayTitle: "Blade Runner 2049",
    tagline: "More human than human.",
    poster: "/cinema/posters/blade-runner.jpg",
    description:
      "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years.",
    displayGenre: "Sci-Fi / Mystery",
    featuredRating: 8.8,
  },
};

/**
 * Resolves editorial metadata for any movie object, ensuring 100% data contract compatibility
 * with live database records while adding editorial gloss.
 */
export function getMovieEditorial(movie: Movie, index: number = 0) {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[:.,_'-]+/g, " ")
      .replace(/\s+/g, " ");

  const normalizedKey = normalize(movie.title);

  // Check direct key or substring matches
  let match = KNOWN_MOVIE_METADATA[normalizedKey];
  if (!match) {
    for (const [key, val] of Object.entries(KNOWN_MOVIE_METADATA)) {
      const cleanKey = normalize(key);
      if (
        normalizedKey === cleanKey ||
        normalizedKey.includes(cleanKey) ||
        cleanKey.includes(normalizedKey)
      ) {
        match = val;
        break;
      }
    }
  }

  // Fallback poster based on deterministic index
  const fallbackPoster = POSTER_POOL[index % POSTER_POOL.length];

  // Clean formatted title if not found in known metadata
  const cleanTitle =
    match?.displayTitle ||
    movie.title
      .replace(/_/g, " ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const tagline =
    match?.tagline ||
    `A captivating ${movie.genre.toLowerCase()} journey in cinema.`;

  const description =
    match?.description ||
    `Curated as part of Sohail's personal cinema collection, exploring ${movie.genre} storytelling, direction, and memorable cinematic moments.`;

  const poster = match?.poster || fallbackPoster;
  const displayGenre = match?.displayGenre || movie.genre;
  const rating = match?.featuredRating || movie.rating || 8.5;

  return {
    id: movie.id,
    title: cleanTitle,
    rawTitle: movie.title,
    genre: displayGenre,
    rawGenre: movie.genre,
    rating,
    trailerUrl: movie.movie_url || movie.trailer_url,
    movieUrl: movie.movie_url || movie.trailer_url,
    poster,
    tagline,
    description,
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
