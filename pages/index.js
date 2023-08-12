import { useEffect } from "react";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard");
    // eslint-disable-next-line
  }, []);
  return null;
};

export default Home;
