"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { loginAction } from "@/app/log-in/action/loginAction";
import { useRouter } from "next/navigation";

const LoginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rememberMe: z.boolean().optional(),
});

type LoginFormType = z.infer<typeof LoginSchema>;

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormType>({
        resolver: zodResolver(LoginSchema),
    });

    const router = useRouter()

    const onSubmit = async (data: LoginFormType) => {
        try {
            const formData = new FormData();
            formData.append("email", data.email);
            formData.append("password", data.password);
            if (data.rememberMe) formData.append("rememberMe", "true");

            const result = await loginAction(formData);

            if (result?.error) {
                toast.error(result.error);
                return;
            }

            toast.success("Login successful 🎉");
            if (result?.success) {
                router.push('/movies')
            }
        } catch (err) {
            toast.error("Something went wrong, please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center relative overflow-hidden h-full">
            <div className="w-full max-w-[300px] px-4 relative z-10">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col"
                    method="POST"
                >
                    <h1 className="text-white text-center font-bold mb-[40px] text-6xl">
                        Sign in
                    </h1>

                    {/* Email Input */}
                    <div className="mb-[16px]">
                        <div className="w-full h-[45px] rounded-[10px] bg-input-color px-4 flex items-center">
                            <input
                                type="email"
                                placeholder="Email"
                                {...register("email")}
                                className="w-full bg-transparent border-none outline-none text-white placeholder-white  text-[14px] leading-6"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className="mb-[16px]">
                        <div className="w-full h-[45px] rounded-[10px] bg-input-color px-4 flex items-center">
                            <input
                                type="password"
                                placeholder="Password"
                                {...register("password")}
                                className="w-full bg-transparent border-none outline-none text-white placeholder-white  text-[14px] leading-6"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center justify-center mb-[16px]">
                        <label className="flex items-center gap-[8px] cursor-pointer">
                            <input
                                type="checkbox"
                                {...register("rememberMe")}
                                className="
                  appearance-none
                  w-[15px] h-[15px] rounded-md
                  bg-gray-700 border border-gray-400
                  checked:bg-blue-500
                  checked:border-blue-500
                  checked:[background-image:url('/check.svg')]
                  checked:bg-center checked:bg-no-repeat
                  cursor-pointer
                "
                            />
                            <span className="text-white text-sm">Remember me</span>
                        </label>
                    </div>

                    <p className="text-muted-foreground text-sm text-center">
                        Don't have an account?{" "}
                        <a className="text-blue-300 hover:underline" href="/sign-up">
                            Sign up
                        </a>
                    </p>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-[54px] rounded-[10px] bg-primary text-white font-bold text-[16px] leading-6 hover:opacity-90 transition-opacity"
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
