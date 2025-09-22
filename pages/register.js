import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../src/redux/authSlice";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Mail, Lock, User as UserIcon } from "lucide-react";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const router = useRouter();

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-800 p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-indigo-300 to-pink-300 bg-clip-text text-transparent">
          Create Account ✨
        </h2>
        <p className="text-center text-gray-200 text-sm mt-2 mb-10">
          Register now and start managing your expenses smartly
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="relative">
            <UserIcon className="absolute left-4 top-3.5 text-gray-300 w-5 h-5" />
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="Full Name"
              className="pl-12 pr-4 py-3 w-full rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
            />
            {errors.name && (
              <p className="text-pink-200 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-300 w-5 h-5" />
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="Email address"
              className="pl-12 pr-4 py-3 w-full rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
            />
            {errors.email && (
              <p className="text-pink-200 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-300 w-5 h-5" />
            <input
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              type="password"
              placeholder="Password"
              className="pl-12 pr-4 py-3 w-full rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
            />
            {errors.password && (
              <p className="text-pink-200 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition transform"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Error */}
          {error && <p className="text-pink-200 text-center mt-3">{error}</p>}
        </form>

        {/* Switch link */}
        <p className="mt-6 text-center text-sm text-gray-200">
          Already have an account?{" "}
          <a href="/login" className="text-pink-300 font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
