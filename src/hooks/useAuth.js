import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { loginUser } from "../redux/authSlice";

const useAuth = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        try {
          const res = await axios.get("/api/auth/me", { withCredentials: true });
          dispatch(loginUser.fulfilled(res.data)); // manually update redux
        } catch (err) {
          router.push("/login");
        }
      }
    };
    checkAuth();
  }, [user, dispatch, router]);

  return user;
};

export default useAuth;
