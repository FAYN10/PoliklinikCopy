import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getItem } from "utils/cookies";

// client-side only
function RouteGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  function authCheck(url) {
    const clientToken = getItem("client");
    const publicPaths = ["/login"];
    const path = url.split("?")[0];
    if (clientToken === null && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push("/login");
    } else if (clientToken !== null && publicPaths.includes(path)) {
      setAuthorized(true);
      router.push("/");
    } else {
      setAuthorized(true);
    }
  }

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);
    // on route change start - hide page content by setting authorized to false
    // const hideContent = () => setAuthorized(false);
    // router.events.on("routeChangeStart", hideContent);
    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);
    // unsubscribe from events in useEffect return function
    return () => {
      // router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return authorized && children;
}

export default RouteGuard;
