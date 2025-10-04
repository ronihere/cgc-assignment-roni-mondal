import CreateMovieForm from '@/app/components/client/CreateOrEditMovie'
import { connectDB } from '@/lib/mongo';
import { Movie } from '@/app/models/movie';


export default async function page({
    params,
}: {
    params: { slug: string };
}) {
    const movieId = params?.slug;
    const movie = await getMovieById(movieId as string);
    return (
        <CreateMovieForm isEdit={true} defaultValue={movie} />
    )
}

async function getMovieById(id: string) {
    try {
        await connectDB();
        if (!id) {
            throw Error("Invalid ID");
        }
        const movie = await Movie.findOne({ _id: id });
        return {
            title: movie?.title || '',
            poster: movie?.poster,
            publishingYear: movie?.publishingYear || '',
            _id: movie._id.toString(),
            // createdAt: movie.createdAt?.toISOString(),
            // updatedAt: movie.updatedAt?.toISOString(),
            // createdBy: movie.createdBy?.toString(), // if it’s ObjectId or Buffer
        };
    } catch (error) {

    }

}

