import { loginAction } from "@/app/log-in/action/loginAction";

export default async function Login() {
    return (
        <div className="flex items-center justify-center relative overflow-hidden h-full">
            <div className="w-full max-w-[300px] px-4 relative z-10">
                <form action={loginAction} className="flex flex-col" method="POST">
                    {/* Heading */}
                    <h1 className="text-white text-center font-bold mb-[40px] text-6xl">
                        Sign in
                    </h1>

                    {/* Email Input */}
                    <div className="mb-[16px]">
                        <div className="w-full h-[45px] rounded-[10px] bg-input-color px-4 flex items-center">
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                // {...register("email")}
                                className="w-full bg-transparent border-none outline-none text-white placeholder-white font-montserrat text-[14px] leading-6"
                            />
                        </div>

                    </div>

                    {/* Password Input */}
                    <div className="mb-[16px]">
                        <div className="w-full h-[45px] rounded-[10px] bg-input-color px-4 flex items-center">
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                // {...register("password")}
                                className="w-full bg-transparent border-none outline-none text-white placeholder-white font-montserrat text-[14px] leading-6"
                            />
                        </div>

                    </div>

                    {/* Remember me */}
                    <div className="flex items-center justify-center mb-[16px]">
                        <label className="flex items-center gap-[8px] cursor-pointer">
                            <div
                                className="w-[18px] h-[17px] rounded-[5px] bg-input-color flex items-center justify-center cursor-pointer"
                            // onClick={() => setValue("rememberMe", !rememberMe)}
                            >

                                <svg
                                    width="12"
                                    height="10"
                                    viewBox="0 0 12 10"
                                    fill="none"
                                >
                                    <path
                                        d="M1 5L4.5 8.5L11 1.5"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>

                            </div>
                            <span className="text-white text-[14px] leading-6">
                                Remember me
                            </span>
                        </label>
                    </div>

                    <p className="text-muted-foreground text-sm text-center">Don't have an account? <a className="text-blue-300 hover:underline" href="/sign-up">
                        Sign up
                    </a></p>


                    <button
                        type="submit"
                        className="w-full h-[54px] rounded-[10px] bg-primary text-white font-bold text-[16px] leading-6 hover:opacity-90 transition-opacity"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
