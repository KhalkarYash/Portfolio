import { useLayoutEffect, useRef } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { resumeLink } from "@/features/portfolio/config";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const photograph = hero.querySelector(".hero-photograph");
      const image = hero.querySelector(".hero-photograph-image");
      const content = hero.querySelector(".hero-content");
      const name = hero.querySelector(".hero-name");
      const intro = hero.querySelector(".hero-intro");
      if (!photograph || !image || !content || !name || !intro) return;

      gsap.fromTo(
        image,
        { scale: 1.12 },
        { scale: 1.08, duration: 2.4, ease: "power2.out" },
      );

      gsap.timeline({ defaults: { ease: "power2.out" } })
        .fromTo(name, { autoAlpha: 0, filter: "blur(1.5px)" }, { autoAlpha: 1, filter: "blur(0px)", duration: 1.05, delay: 0.12 })
        .fromTo(intro, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, "-=0.55");

      gsap.to(photograph, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      gsap.to(content, {
        yPercent: 8,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    });

    return () => media.revert();
  }, []);

  return (
    <section ref={heroRef} id="home" className="hero-scene relative isolate flex min-h-[88svh] items-end overflow-hidden text-white md:min-h-[92svh]">
      <div className="hero-photograph absolute inset-0 -z-20" aria-hidden="true">
        <div className="hero-photograph-image absolute inset-0" />
      </div>
      <div className="hero-shade absolute inset-0 -z-10" aria-hidden="true" />

      <div className="hero-content mx-auto w-full max-w-[1440px] px-6 pb-16 pt-32 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24">
        <div>
          <h1 className="hero-name max-w-5xl font-serif text-[clamp(4.25rem,11vw,10.5rem)] leading-[0.82] tracking-[-0.065em] text-white">
            Yash Khalkar<span className="hero-period">.</span>
          </h1>
          <div
            className="mt-8 flex flex-col gap-7 sm:mt-10 sm:flex-row sm:items-end sm:justify-between"
          >
            <p className="hero-intro max-w-md text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              I build thoughtful digital products, from the first interface to the systems behind it.
            </p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
              <a href="#work-projects" className="hero-link group">
                Explore my work <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
              </a>
              <a href={resumeLink} target="_blank" rel="noopener noreferrer" className="hero-link hero-link-muted group">
                Resume <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-grain pointer-events-none absolute inset-0 -z-[5]" aria-hidden="true" />
    </section>
  );
}
