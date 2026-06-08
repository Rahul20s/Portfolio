import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import Lenis from "lenis";
import { FaBars, FaTimes } from "react-icons/fa";
import ContactModal from "./ContactModal";
import { track } from "@vercel/analytics";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);
export let lenis: Lenis | null = null;

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.7,
      touchMultiplier: 2,
      infinite: false,
    });

    // Start paused
    lenis.stop();

    // Handle smooth scroll animation frame
    function raf(time: number) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Handle navigation links
    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        let currentElem = e.currentTarget as HTMLAnchorElement;
        let section = currentElem.getAttribute("data-href");
        if (window.innerWidth > 1024 && section) {
          e.preventDefault();
          if (lenis) {
            const target = document.querySelector(section) as HTMLElement;
            if (target) {
              lenis.scrollTo(target, {
                offset: 0,
                duration: 1.5,
              });
            }
          }
        }
      });
    });

    // Handle resize
    window.addEventListener("resize", () => {
      lenis?.resize();
    });

    return () => {
      lenis?.destroy();
    };
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="header">
        <a href="/#" className="navbar-title" data-cursor="disable" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/images/Profile.webp" alt="Rahul Sharma" style={{ width: '55px', height: '55px', borderRadius: '50%', objectFit: 'cover' }} />
        </a>
        <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <nav>
          <ul className={isMobileMenuOpen ? "mobile-open" : ""}>
            <li onClick={closeMenu}>
              <a data-href="#about" href="#about">
                <HoverLinks text="ABOUT" />
              </a>
            </li>
            <li onClick={closeMenu}>
              <a data-href="#work" href="#work">
                <HoverLinks text="WORK" />
              </a>
            </li>
            <li onClick={closeMenu}>
              <a data-href="#contact" href="#contact">
                <HoverLinks text="CONTACT" />
              </a>
            </li>
            <li onClick={closeMenu}>
              <a href="/Resume.pdf" download="Rahul_Sharma_Resume.pdf" target="_blank" rel="noopener noreferrer" onClick={() => track("Resume Downloaded")}>
                <HoverLinks text="RESUME" />
              </a>
            </li>
            <li>
              <button className="book-call-btn" onClick={() => { 
                closeMenu(); 
                setIsContactModalOpen(true); 
                track("Book Call Clicked");
              }}>
                Book a Call
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
