import Error404 from "../../images/404.svg";
import NavBar from "../../Components/Website/NavBar";
import MobileNavBar from "../Website/MobileNavBar";
import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section class="scroll-bar">
      <div className="hidden md:block">
        <NavBar />
      </div>
      <div className="md:hidden">
        <MobileNavBar />
      </div>
      <div class="flex justify-center items-center mt-8">
        <div class="flex justify-center w-full">
          <div class="md:w-1/2 text-center">
            <img src={Error404} className="w-5/6" alt="Page Not Found" />
            <h3 class="mt-12 mb-15">Oops! Page not found</h3>
            <p>
              It&apos;s looking like you may have taken a wrong turn. Don&apos;t
              worry... it happens to the best of us. Here&apos;s a little tip
              that might help you get back on track.
            </p>
            <Link to="/">
              <button className="bg-primaryColor text-center text-white text-lg font-semibold text-wrap mt-10 w-40 h-12 rounded-lg">
                Back To Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
