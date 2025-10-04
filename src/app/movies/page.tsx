import { TMovie } from '@/lib/constant';
import LogoutButton from './components/LogoutButton';
import AddMovieButton from './components/AddMovieButton';
import Link from 'next/link';
import { Movie } from '../models/movie';
import { connectDB } from '@/lib/mongo';

export default async function Movies({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const currentPage = parseInt(searchParams?.page as string) || 1;
    const { movies, totalPages } = await getMovies(currentPage)
    return (
        <div className="h-screen">

            <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 md:space-y-16">
                <div className="flex items-center">
                    <div className="flex items-center gap-4 w-full">
                        <h1
                            className="text-white font-semibold text-2xl md:text-5xl"
                        >
                            My movies
                        </h1>
                        <AddMovieButton />
                        <LogoutButton />
                    </div>

                </div>

                {/* Movie Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8">
                    {movies.map((movie) => (
                        <Link
                            href={`/movies/${movie._id}`}
                            key={movie._id}
                            className="
                            rounded-xl p-2 pb-4 blur-effect-card
                            bg-[#092C39] backdrop-blur-3xl
                          "
                        >
                            <div className="mb-4">
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="w-full h-[50vh] md:h-80 object-cover rounded-xl"
                                />
                            </div>
                            <div className="px-2">
                                <h3
                                    className="text-white mb-2 font-medium text-lg"
                                >
                                    {movie.title}
                                </h3>
                                <p
                                    className="text-white font-medium text-md"

                                >
                                    {movie.publishingYear}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>


                <div className="flex items-center justify-center gap-2 p-4">
                    {currentPage > 1 && (
                        <Link
                            href={`/movies?page=${currentPage - 1}`}
                            className="px-3 py-1 text-white bg-card-color rounded hover:bg-primary"
                        >
                            Prev
                        </Link>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Link
                            key={page}
                            href={`/movies?page=${page}`}
                            className={`px-3 py-1 rounded font-bold ${page === currentPage ? "bg-primary text-white" : "bg-card-color text-white"
                                }`}
                        >
                            {page}
                        </Link>
                    ))}

                    {currentPage < totalPages && (
                        <Link
                            href={`/movies?page=${currentPage + 1}`}
                            className="px-3 py-1 text-white bg-card-color rounded hover:bg-primary"
                        >
                            Next
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
async function getMovies(page: number): Promise<{ movies: TMovie[], totalPages: number }> {
    await connectDB();
    const limit = 4
    const movies = await Movie.find({})
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        ;
    const total = await Movie.countDocuments();
    const totalPages = Math.ceil(total / limit);
    return { movies, totalPages }
}