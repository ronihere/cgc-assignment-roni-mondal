"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { TMovie } from "@/lib/constant";
import { EditIcon } from "lucide-react";
import PrimaryButton from "./primaryButton";
import SecondaryButton from "./SecondaryButton";


const MovieSchema = z.object({
    title: z.string().min(1, "Title is required"),
    publishingYear: z
        .string()
        .regex(/^\d{4}$/, "Publishing year must be a valid year"),
    poster: z
        .instanceof(File)
        .refine((file) => file.type.startsWith("image/"), {
            message: "Only image files are allowed",
        }),
});
export const MoviePatchSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    publishingYear: z
        .string()
        .regex(/^\d{4}$/, "Publishing year must be a valid year")
        .optional(),
    poster: z
        .any() 

});
type MovieFormValues = z.infer<typeof MovieSchema>;
type MoviePatchFormValues = z.infer<typeof MoviePatchSchema>;

export default function CreateMovieForm({ isEdit = false, defaultValue }: { isEdit?: boolean, defaultValue?: TMovie }) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<MovieFormValues | MoviePatchFormValues>({
        resolver: zodResolver(isEdit ? MoviePatchSchema : MovieSchema),
        defaultValues: {
            title: defaultValue?.title || "",
            publishingYear: defaultValue?.publishingYear?.toString() || "",
        },
    });

    useEffect(() => {
        if (isEdit && defaultValue?.poster) {
            setImagePreview(defaultValue.poster)
        }
    }, [isEdit, defaultValue])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setValue("poster", file);
        }
    };

    const onSubmit = async (data: MovieFormValues | MoviePatchFormValues) => {
        const title = data.title ?? "";
        const publishingYear = data.publishingYear ?? "";
        const poster = data?.poster; 
        const formData = new FormData();
        if (title) formData.append("title", title);
        if (publishingYear) formData.append("publishingYear", publishingYear);
        if (poster && poster?.length !== 0) formData.append("file", poster);
        if (isEdit) {
            if (defaultValue?._id) {
                formData.append("movieId", defaultValue?._id?.toString());
            } else {
                toast.error("Movie ID is missing for edit operation.")
                return;
            }
        }

        const res = await fetch(`${window.location.origin}/api/movies`, {
            method: isEdit ? 'PATCH' : "POST",
            body: formData,
        });

        if (!res.ok) {
            toast.error("Failed to submit the form. Please try again.")
            return;
        }

        const json = await res.json();
        toast.success(`Movie ${isEdit ? "edited" : "created"} successfully 🎉`)
        router.push('/movies');
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-20 space-y-6">
                <h1 className="text-white font-bold text-xl md:text-4xl mb-8 md:mb-0">
                    {isEdit ? `Edit` : "Create a new movie"}
                </h1>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-28 md:pt-4">
                    <div className="w-full lg:w-1/2  order-2 md:order-1">
                        <input
                            type="file"
                            accept="image/*"
                            {...register("poster")}
                            onChange={handleFileChange}
                            className="hidden"
                            id="posterInput"
                        />

                        <label
                            htmlFor="posterInput"
                            className="w-full h-[40vh] lg:h-[60vh] rounded-[10px] bg-input-color border-2 border-dashed border-white flex flex-col items-center justify-center cursor-pointer relative group overflow-hidden"
                        >
                            {imagePreview ? (
                                <>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-[10px] transition-opacity group-hover:opacity-80"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-semibold text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <EditIcon />
                                    </div>
                                </>
                            ) : (
                                <p className="text-white text-center">Drop an image here</p>
                            )}
                        </label>



                        {errors.poster && (
                            <p className="text-red-500 text-sm">{errors.poster.message?.toString()}</p>
                        )}

                    </div>

                    <div className="flex-1 flex flex-col order-1 md:order-2 space-y-6">
                        <div className="">
                            <div className="w-full lg:w-[362px] h-[45px] rounded-[10px] bg-input-color px-4 flex items-center">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    {...register("title")}
                                    className="w-full bg-transparent border-none outline-none text-white placeholder-white  text-[14px] leading-6"
                                />
                            </div>
                            {errors.title && (
                                <p className="text-red-500 text-sm">{errors.title.message?.toString()}</p>
                            )}
                        </div>

                        <div className="">
                            <div className="w-full lg:w-[216px] h-[45px] rounded-[10px] bg-input-color px-4 flex items-center">
                                <input
                                    type="text"
                                    placeholder="Publishing year"
                                    {...register("publishingYear")}
                                    className="w-full bg-transparent border-none outline-none text-white placeholder-white  text-[14px] leading-6"
                                />
                            </div>
                            {errors.publishingYear && (
                                <p className="text-red-500 text-sm">
                                    {errors.publishingYear.message?.toString()}
                                </p>
                            )}
                        </div>

                        <div className="gap-4 hidden md:flex">
                            <SecondaryButton
                                type="button"
                                onClick={() => router.back()}
                            >Cancel</SecondaryButton>

                            <PrimaryButton
                                disabled={isSubmitting} type="submit" className="" >Submit</PrimaryButton>
                        </div>
                    </div>

                </div>
                <div className="gap-4 flex md:hidden">
                    <SecondaryButton
                        type="button"
                        onClick={() => router.back()}
                    >Cancel</SecondaryButton>

                    <PrimaryButton
                        disabled={isSubmitting} type="submit" className="" >Submit</PrimaryButton>
                </div>
            </div>
        </form>
    );
}
