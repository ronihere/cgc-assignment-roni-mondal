import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
    static async uploadImage(image: Buffer, folder = "uploads"): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error("Cloudinary upload failed"));
                    resolve(result.secure_url); // now result is definitely defined
                }
            );

            uploadStream.end(image);
        });
    }
}
