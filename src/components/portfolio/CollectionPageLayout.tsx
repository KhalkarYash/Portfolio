import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/portfolio/ThemeToggle";

type CollectionState = "loading" | "error" | "ready";

interface CollectionPageLayoutProps {
  title: string;
  description: string;
  state: CollectionState;
  errorMessage: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function CollectionPageLayout({
  title,
  description,
  state,
  errorMessage,
  children,
  footer,
}: CollectionPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="relative mx-auto max-w-[1120px] px-6 pb-24 pt-8 sm:px-10 lg:px-16">
        <div className="mb-16 flex items-center justify-between border-b border-border pb-5">
          <Link to="/" className="site-mark" aria-label="Yash Khalkar, home">
            YK<span>.</span>
          </Link>
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/"
            className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">←</span>
            Back to Home
          </Link>
        </motion.div>

        <motion.header
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="mb-3 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </motion.header>

        {state === "loading" ? (
          <div className="flex justify-center py-20" role="status" aria-label="Loading">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : state === "error" ? (
          <p className="py-20 text-center text-sm text-muted-foreground" role="alert">
            {errorMessage}
          </p>
        ) : (
          children
        )}

        {footer}
      </main>
    </div>
  );
}
