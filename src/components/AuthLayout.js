import Link from "next/link";

export default function AuthLayout({ title, children, switchText, switchLink }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
        {children}
        <p className="text-sm text-gray-600 text-center mt-4">
          {switchText}{" "}
          <Link href={switchLink} className="text-blue-500 hover:underline">
            here
          </Link>
        </p>
      </div>
    </div>
  );
}
