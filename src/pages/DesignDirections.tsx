import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, Github, Laptop, Music2, VolumeX, X } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/portfolio/ThemeToggle";
import { ThirdPersonWorld } from "@/components/portfolio/ThirdPersonWorld";
import { experiences, techStack } from "@/features/portfolio/content";
import { useProjectsQuery } from "@/features/portfolio/queries";
import type { RadioLanguage } from "@/features/portfolio/game/worldAudio";

const exhibits = [
  { id: "work", title: "Projects" },
  { id: "journey", title: "Experience" },
  { id: "craft", title: "Craft" },
  { id: "beyond", title: "Beyond work" },
] as const;

type ExhibitId = (typeof exhibits)[number]["id"];

function ExhibitDetails({ id, onClose }: { id: ExhibitId; onClose: () => void }) {
  const { data: projects = [], isPending } = useProjectsQuery();
  const project = projects[0];
  const experience = experiences[0];

  return (
    <div className="third-person-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="third-person-dialog" role="dialog" aria-modal="true" aria-labelledby="exhibit-title">
        <button type="button" className="third-person-dialog-close" onClick={onClose} aria-label="Close exhibit"><span>ESC</span><X aria-hidden="true" /></button>
        {id === "work" && <>
          <p className="world-eyebrow">EXHIBIT / PROJECTS</p>
          <h2 id="exhibit-title">{isPending ? "Loading the work…" : project?.title ?? "Selected work"}</h2>
          {project?.image && <img className="third-person-project-image" src={project.image} alt={`${project.title} project`} />}
          <p className="third-person-dialog-copy">{project?.description ?? "A selection of things I’ve helped bring to life."}</p>
          <div className="world-discovery-links">
            {project?.link && <a href={project.link} target="_blank" rel="noopener noreferrer">Open project <ArrowUpRight aria-hidden="true" /></a>}
            {project?.github && <a href={project.github} target="_blank" rel="noopener noreferrer"><Github aria-hidden="true" /> Source</a>}
            <Link to="/projects">See all projects <ArrowUpRight aria-hidden="true" /></Link>
          </div>
        </>}
        {id === "journey" && <>
          <p className="world-eyebrow">EXHIBIT / EXPERIENCE</p>
          <h2 id="exhibit-title">The long game.</h2>
          <div className="third-person-highlight"><span>{experience.year}</span><strong>{experience.role}</strong><p>{experience.company} · {experience.location}</p></div>
          <p className="third-person-dialog-copy">{experience.description}</p>
          <Link className="third-person-text-link" to="/#experience">Walk the full timeline <ArrowUpRight aria-hidden="true" /></Link>
        </>}
        {id === "craft" && <>
          <p className="world-eyebrow">EXHIBIT / CRAFT</p>
          <h2 id="exhibit-title">Tools are choices.</h2>
          <p className="third-person-dialog-copy">I choose the right tools for the job, then focus on making the whole system feel considered.</p>
          <div className="third-person-tool-grid">{techStack.slice(0, 4).map((category) => <div key={category.category}><span>{category.category}</span><p>{category.items.join(" · ")}</p></div>)}</div>
        </>}
        {id === "beyond" && <>
          <p className="world-eyebrow">EXHIBIT / BEYOND WORK</p>
          <h2 id="exhibit-title">Different kind of innings.</h2>
          <p className="third-person-dialog-copy">Cricket, cinema, and stories told on stage. I’ll happily talk about why <em>Pyaasa</em> still stays with you.</p>
          <Link className="third-person-text-link" to="/#beyond-work">A little more about that <ArrowUpRight aria-hidden="true" /></Link>
        </>}
      </section>
    </div>
  );
}

export default function DesignDirections() {
  const [nearby, setNearby] = useState<ExhibitId | "car" | "race" | null>(null);
  const [opened, setOpened] = useState<ExhibitId | null>(null);
  const [discovered, setDiscovered] = useState<ExhibitId[]>([]);
  const [inCar, setInCar] = useState(false);
  const [vehicleName, setVehicleName] = useState<string | null>(null);
  const [radioEnabled, setRadioEnabled] = useState(true);
  const [radioLanguage, setRadioLanguage] = useState<RadioLanguage>("hindi");
  const [convertible, setConvertible] = useState(false);
  const [roofOpen, setRoofOpen] = useState(false);
  const [pedestrianHits, setPedestrianHits] = useState(0);
  const [raceActive, setRaceActive] = useState(false);
  const [gameScreenSupported, setGameScreenSupported] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 900px)").matches,
  );
  const completed = discovered.length === exhibits.length;

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpened(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    const screenQuery = window.matchMedia("(min-width: 900px)");
    const updateScreenSupport = () => setGameScreenSupported(screenQuery.matches);
    screenQuery.addEventListener("change", updateScreenSupport);
    return () => screenQuery.removeEventListener("change", updateScreenSupport);
  }, []);

  const explore = (id: ExhibitId) => {
    setDiscovered((items) => items.includes(id) ? items : [...items, id]);
    setOpened(id);
  };
  const currentExhibit = exhibits.find((exhibit) => exhibit.id === nearby);

  return (
    <main className="game-lab-page world-game-page">
      <div className="game-lab-nav">
        <Link to="/" className="site-mark" aria-label="Back to Yash Khalkar portfolio">YK<span>.</span></Link>
        <span className="game-lab-index">YASH KHALKAR / PLAYABLE PORTFOLIO</span>
        <ThemeToggle />
      </div>

      <header className="world-game-heading">
        <div>
          <Link to="/" className="game-lab-back"><ArrowLeft aria-hidden="true" /> Back to portfolio</Link>
          <p className="section-index">A THIRD-PERSON PORTFOLIO GAME</p>
          <h1>Take the ride.<br /><em>Find the work.</em></h1>
        </div>
        <div className="world-game-intro">
          <p>Find a ride. The race circuit is beyond the east end of town; pull up beside an exhibit to explore the work.</p>
          <div className="world-game-objective"><span>YOUR FIELD NOTES</span><strong>{completed ? "All exhibits found" : `${discovered.length} / 4 exhibits found`}</strong><div><i style={{ width: `${discovered.length * 25}%` }} /></div></div>
        </div>
      </header>

      <section className="third-person-game" aria-label="Playable portfolio world">
        {gameScreenSupported ? <>
        <ThirdPersonWorld
          discovered={discovered}
          paused={Boolean(opened)}
          onExplore={explore}
          onNearbyChange={setNearby}
          onRaceChange={setRaceActive}
          onVehicleChange={setInCar}
          onVehicleNameChange={setVehicleName}
          onConvertibleChange={setConvertible}
          onRoofStateChange={setRoofOpen}
          radioEnabled={radioEnabled}
          radioLanguage={radioLanguage}
          onRadioEnabledChange={setRadioEnabled}
          onPedestrianHit={() => setPedestrianHits((hits) => hits + 1)}
        />
        <div className="third-person-hud" aria-live="polite">
          <span><i className="third-person-hud-dot" /> {raceActive ? "RACE / LIVE" : inCar ? `${vehicleName ?? "RIDE"} / FREE ROAM` : "ON FOOT / FREE ROAM"}</span>
          <span>{String(discovered.length).padStart(2, "0")} EXHIBITS&nbsp; · &nbsp;{pedestrianHits} PEDESTRIAN HITS&nbsp; · &nbsp;{discovered.length * 250 + pedestrianHits * 25} XP</span>
        </div>
        {nearby && !opened && <div className="third-person-prompt" aria-live="polite"><kbd>{nearby === "race" ? "R" : "E"}</kbd><span>{nearby === "car" ? <>Take the <strong>ride</strong></> : nearby === "race" ? <><strong>{raceActive ? "End the race" : "Start the circuit"}</strong></> : <>Explore <strong>{currentExhibit?.title}</strong></>}</span></div>}
        <div className="third-person-controls" aria-label="Game controls">
          <div className="third-person-key-group"><span><kbd>W</kbd></span><span><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></span><small>{inCar ? "DRIVE" : "LOCAL MOVE"}</small></div>
          <div className="third-person-key-group"><span><kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd></span><small>{inCar ? "DRIVE" : "MOVE / TURN"}</small></div>
          <div className="third-person-key-group"><span><kbd>E</kbd></span><small>{inCar ? "EXIT / EXPLORE" : "SNATCH / EXPLORE"}</small></div>
          <div className="third-person-key-group"><span><kbd>SHIFT</kbd></span><small>{inCar ? "BOOST" : "RUN"}</small></div>
          {inCar && <div className="third-person-key-group"><span><kbd>SPACE</kbd></span><small>HANDBRAKE</small></div>}
          {inCar && <div className="third-person-key-group"><span><kbd>R</kbd></span><small>{raceActive ? "END RACE" : "RACE AT CIRCUIT"}</small></div>}
          {inCar && <button type="button" className="third-person-radio-toggle" onClick={() => setRadioEnabled((enabled) => !enabled)} aria-pressed={radioEnabled} aria-label={radioEnabled ? "Stop the radio" : "Play the radio"}>
            {radioEnabled ? <VolumeX aria-hidden="true" /> : <Music2 aria-hidden="true" />}
            {radioEnabled ? "RADIO OFF" : "RADIO ON"}
          </button>}
          {inCar && <div className="third-person-radio-stations" role="group" aria-label="Radio language">
            <span>STATION</span>
            {(["hindi", "english"] as const).map((language) => <button key={language} type="button" onClick={() => setRadioLanguage(language)} aria-pressed={radioLanguage === language}>
              {language === "hindi" ? "हिन्दी" : "ENGLISH"}
            </button>)}
          </div>}
          {inCar && convertible && <button type="button" className="third-person-radio-toggle" onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyT", bubbles: true }))} aria-pressed={roofOpen} aria-label={roofOpen ? "Close the convertible roof" : "Open the convertible roof"}>
            {roofOpen ? "CLOSE ROOF" : "OPEN ROOF"} <kbd>T</kbd>
          </button>}
          <div className="third-person-control-note">{inCar ? "Move mouse to orbit · East of town: R at the start line · E to explore" : "Move mouse to orbit · W / S forward · A / D strafe · ← / → turn"}</div>
          <div className="third-person-map" aria-label="Exhibit map">{exhibits.map((exhibit) => <span key={exhibit.id} className={discovered.includes(exhibit.id) ? "is-found" : ""} title={exhibit.title}>{discovered.includes(exhibit.id) ? <Check aria-hidden="true" /> : null}</span>)}</div>
        </div>
        {opened && <ExhibitDetails id={opened} onClose={() => setOpened(null)} />}
        </> : <div className="game-screen-gate" role="status" aria-live="polite">
          <div className="game-screen-gate-mark"><Laptop aria-hidden="true" /></div>
          <p className="game-screen-gate-label">A BIGGER SCREEN, PLEASE</p>
          <h2>Please use a laptop<br />screen to play.</h2>
          <p className="game-screen-gate-copy">This 3D world is designed for a wider screen and keyboard. Open it on a laptop or desktop to explore.</p>
          <span className="game-screen-gate-threshold">AVAILABLE AT 900 PX AND WIDER</span>
        </div>}
      </section>

      <footer className="game-lab-footer">
        <span>AN INTERACTIVE STUDY / BUILT FROM THE REAL PORTFOLIO</span>
        <Link to="/">Return to the portfolio <ArrowUpRight aria-hidden="true" /></Link>
      </footer>
    </main>
  );
}
