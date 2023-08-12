import RouteGuard from "components/RouteGuard";
import Layout from "components/layout";
import { useRouter } from "next/router";
import { ActiveTabProvider } from "context/ActiveTabContext";
import "styles/globals.scss";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const fullScreenLayoutList = ["/login"];
  const isFullScreenLayout = fullScreenLayoutList.includes(router.pathname);
  return (
    <RouteGuard>
      <ActiveTabProvider>
        {isFullScreenLayout ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </ActiveTabProvider>
    </RouteGuard>
  );
}

export default MyApp;
