import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const letterboxdUrl = "https://letterboxd.com/yashkhalkar/";

export function BeyondWorkSection() {
  return (
    <section id="beyond-work">
      <SectionHeader number="08" title="Beyond work" />

      <motion.div
        className="beyond-work-grid"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="community-feature">
          <div className="community-count-block">
            <span className="community-count">12+</span>
            <p>community tech events led</p>
          </div>
          <div className="community-detail">
            <p className="community-role">GDG ON CAMPUS LEAD / MET INSTITUTE OF ENGINEERING</p>
            <h3 className="community-event">Hacktoberfest Nashik ’24</h3>
            <p className="community-description">I co-organized the festival as part of my work leading the campus community.</p>
            <div className="community-stats" aria-label="Hacktoberfest Nashik 2024 impact">
              <p><strong>600+</strong><span>registrations</span></p>
              <p><strong>300+</strong><span>active contributors</span></p>
            </div>
          </div>
        </div>

        <div className="personal-interests">
          <div className="film-note">
            <p className="community-role">FILMS / LETTERBOXD</p>
            <h3 className="community-event">Talk to me about how great <em>Pyaasa</em> is.</h3>
            <p className="community-description">I love watching films, and I keep track of them on Letterboxd.</p>
            <a className="letterboxd-link" href={letterboxdUrl} target="_blank" rel="noopener noreferrer">
              My Letterboxd <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="personal-sidebar">
            <div className="cricket-feature">
              <p className="community-role">CRICKET</p>
              <h3>I love cricket.</h3>
            </div>
            <div className="personal-facts" aria-label="A few things beyond work">
              <p><span>THEATRE</span>I acted in school dramas.</p>
              <p><span>DSA</span>Definitely not my thing.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
