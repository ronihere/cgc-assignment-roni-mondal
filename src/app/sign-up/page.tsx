"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "@/app/schema/auth";
import { useState } from "react";
import PrimaryButton from "../components/client/primaryButton";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            confirmPassword: "",
        },
    });


    const onSubmit = async (data: SignupFormData) => {
        setServerError(null);

        // Example: send to API
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signup`, { method: "POST", body: JSON.stringify(data) })
        if (!res.ok) setServerError("Invalid credentials");
        else {
            router.push('/log-in');
        }
    };

    return (
        <div className="flex items-center justify-center relative overflow-hidden h-full">
            <div className="w-full max-w-[300px] px-4 relative z-10">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                    <h1 className="text-white text-center font-bold mb-[40px] text-6xl">
                        Sign up
                    </h1>

                    <div className="mb-[16px]">
                        <div className="w-full h-[45px] rounded-[10px] bg-input-color px-4 flex items-center">
                            <input
                                type="text"
                                placeholder="Name"
                                {...register("name")}
                                className="w-full bg-transparent border-none outline-none text-white placeholder-white font-montserrat text-[14px] leading-6"
                            />
                        </div>
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="mb-[16px]">
                        <div className="w-full h-[45px] rounded-[10px] bg-input-color px-4 flex items-center">
                            <input
                                type="email"
                                placeholder="Email"
                                {...register("email")}
                                className="w-full bg-transparent border-none outline-none text-white placeholder-white font-montserrat text-[14px] leading-6"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="mb-[16px]">
                        <div className="w-full h-[45px] rounded-[10px] bg-input-color px-4 flex items-center">
                            <input
                                type="password"
                                placeholder="Password"
                                {...register("password")}
                                className="w-full bg-transparent border-none outline-none text-white placeholder-white font-montserrat text-[14px] leading-6"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-[16px]">
                        <div className="w-full h-[45px] rounded-[10px] bg-input-color px-4 flex items-center">
                            <input
                                type="password"
                                placeholder="Password"
                                {...register("confirmPassword")}
                                className="w-full bg-transparent border-none outline-none text-white placeholder-white font-montserrat text-[14px] leading-6"
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>


                    <p className="text-muted-foreground text-sm text-center">Already have an account? <a className="text-blue-300 hover:underline" href="/log-in">
                        Sign in
                    </a></p>
                    {serverError && (
                        <p className="text-red-500 text-xs mb-2">{serverError}</p>
                    )}

                    <PrimaryButton type="button" label="Sign up" onClick={handleSubmit(onSubmit)} className="" />
                </form>
            </div>
        </div>
    );
}
