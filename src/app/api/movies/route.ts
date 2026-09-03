import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { parseMovieListRequest } from "@/services/movie-list/request";
import { getMovies } from "@/services/movie-list/server";
import { tmdbErrorResponse } from "@/services/tmdb/error-response";

export async function GET(request: NextRequest) {
  try {
    const input = parseMovieListRequest(request.nextUrl.searchParams);
    const movies = await getMovies(input);

    return NextResponse.json(movies);
  } catch (error) {
    return tmdbErrorResponse(error);
  }
}
