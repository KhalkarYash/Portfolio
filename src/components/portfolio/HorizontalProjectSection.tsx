import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "./SectionHeader";
import { ProjectCard } from "./ProjectCard";
import { type Project } from "@/utils/types";

gsap.registerPlugin(ScrollTrigger);

interface HorizontalProjectSectionProps {
  id: string;
  number: string;
  title: string;
  projects: Project[];
  error: unknown;
  moreHref: string;
  moreLabel: string;
  moreWhen: number;
}

export function HorizontalProjectSection({
  id,
  number,
  title,
  projects,
  error,
  moreHref,
  moreLabel,
  moreWhen,
}: HorizontalProjectSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const featured = projects.slice(0, 3);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pinned = pinnedRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!section || !pinned || !viewport || !track || !progress || featured.length < 2) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      if (distance() < 24) return;

      section.classList.add("is-animated-rail");
      viewport.classList.add("is-rail-pinned");
      const images = track.querySelectorAll<HTMLImageElement>(".project-image-link img");
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pinned,
          start: "top top+=108",
          end: () => `+=${distance()}`,
          pin: pinned,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline.to(track, { x: () => -distance() }, 0);
      timeline.fromTo(images, { objectPosition: "38% center" }, { objectPosition: "62% center" }, 0);
      timeline.fromTo(progress, { scaleX: 0 }, { scaleX: 1 }, 0);
      ScrollTrigger.refresh();

      return () => {
        viewport.classList.remove("is-rail-pinned");
        section.classList.remove("is-animated-rail");
      };
    });

    return () => media.revert();
  }, [featured.length]);

  return (
    <section ref={sectionRef} id={id} className="horizontal-work-section py-12">
      <div ref={pinnedRef} className="horizontal-pin">
        <SectionHeader number={number} title={title} />
        {error ? (
          <p className="text-sm text-muted-foreground">Unable to load projects right now.</p>
        ) : (
          <div
            ref={viewportRef}
            className="horizontal-viewport"
            role="region"
            aria-label={`${title} gallery`}
            tabIndex={0}
          >
            <div ref={trackRef} className="horizontal-track">
              {featured.map((project, index) => (
                <div className="horizontal-panel" key={project.title}>
                  <ProjectCard project={project} index={index} />
                </div>
              ))}
              {projects.length > moreWhen && (
                <div className="horizontal-panel horizontal-more-panel">
                  <p className="section-index">KEEP EXPLORING</p>
                  <h3 className="mt-5 max-w-md font-serif text-4xl leading-tight text-foreground md:text-5xl">
                    More work, made with intention.
                  </h3>
                  <Link to={moreHref} className="hero-link mt-8 w-fit">
                    {moreLabel} <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="horizontal-progress" aria-hidden="true"><span ref={progressRef} /></div>
      </div>
    </section>
  );
}
