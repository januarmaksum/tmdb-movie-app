import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { tmdbErrorResponse } from "@/lib/api-error-response";
import { parseMovieListRequest } from "@/lib/movie-request";
import { getMovies } from "@/lib/tmdb-movies.server";

export async function GET(request: NextRequest) {
  try {
    const input = parseMovieListRequest(request.nextUrl.searchParams);
    const movies = await getMovies(input);

    return NextResponse.json(movies);
  } catch (error) {
    return tmdbErrorResponse(error);
  }
}
