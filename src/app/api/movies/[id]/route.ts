import { NextResponse } from "next/server";
import { parseMovieId } from "@/services/movie-detail/request";
import { getMovieDetails } from "@/services/movie-detail/server";
import { tmdbErrorResponse } from "@/services/tmdb/error-response";

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
