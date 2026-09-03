import { NextResponse } from "next/server";
import { tmdbErrorResponse } from "@/lib/api-error-response";
import { parseMovieId } from "@/lib/movie-request";
import { getMovieDetails } from "@/lib/tmdb-movies.server";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/movies/[id]">,
) {
  try {
    const { id } = await context.params;
    const movieId = parseMovieId(id);
    const movie = await getMovieDetails(movieId);

    return NextResponse.json(movie);
  } catch (error) {
    return tmdbErrorResponse(error);
  }
}
