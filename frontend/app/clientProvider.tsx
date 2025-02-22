"use client";

import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { store } from "@/redux/store/store";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { HeroUIProvider } from "@heroui/react";
import Navigation from "@/components/Layout/Navigation";
// List of paths where header and footer should not be shown
const HIDDEN_LAYOUT_PATHS = [
  "/user/intro",
  "/new_project",
  "user/dashboard",
] as const;

const ClientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();

  // Check if current path is in the list of paths where layout should be hidden
  const shouldHideLayout = HIDDEN_LAYOUT_PATHS.some((path) =>
    pathname.includes(path)
  );

  // Inverse the condition for better readability
  const showLayout = !shouldHideLayout;

  return (
    <Provider store={store}>
      {/* <ThemeProvider> */}
      {/* <header className="sticky top-0 z-50 bg-background"> */}
      {/* </header> */}
      <HeroUIProvider>
        {showLayout && <Header />}
        {showLayout && <Navigation />}
        {children}
      </HeroUIProvider>
      {/* {showLayout && <Footer />} */}
      {/* </ThemeProvider> */}
    </Provider>
  );
};

export default ClientProvider;
