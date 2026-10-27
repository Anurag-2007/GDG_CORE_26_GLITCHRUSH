import { Route, Router } from "@solidjs/router";
import type { RouteSectionProps } from "@solidjs/router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Members from "./pages/Members";
import NotFound from "./pages/NotFound";

function Layout(props: RouteSectionProps) {
  return (
    <>
      <Navbar />
      <main>{props.children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router root={Layout}>
      <Route path="/" component={Home} />
      <Route path="/members" component={Members} />
      <Route path="*" component={NotFound} />
    </Router>
  );
}
