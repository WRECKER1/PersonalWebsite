"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";

type State = "idle" | "sending" | "sent" | "error";

/**
 * With `endpoint` set (e.g. a Formspree URL in content/site.yaml) the form
 * posts there. Without one it opens the visitor's email client with the
 * message pre-filled, so the form works with no backend at all.
 */
export function ContactForm({ email, endpoint }: { email: string; endpoint?: string }) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const from = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !message || !/^\S+@\S+\.\S+$/.test(from)) {
      setState("error");
      setError("Please add your name, a valid email address and a message.");
      return;
    }
    if (!endpoint) {
      const body = encodeURIComponent(`${message}\n\n— ${name} (${from})`);
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(`A note from ${name}`)}&body=${body}`;
      setState("sent");
      return;
    }
    try {
      setState("sending");
      const res = await fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error();
      form.reset();
      setState("sent");
    } catch {
      setState("error");
      setError(`The message could not be sent. Please write to ${email} instead.`);
    }
  }

  const field =
    "mt-2 w-full border-0 border-b border-ink bg-transparent px-0 py-2 font-serif text-xl placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-0";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <label className="block">
          <span className="kicker">Your name</span>
          <input name="name" type="text" autoComplete="name" required className={field} />
        </label>
        <label className="block">
          <span className="kicker">Email</span>
          <input name="email" type="email" autoComplete="email" required className={field} />
        </label>
      </div>
      <label className="block">
        <span className="kicker">Message</span>
        <textarea name="message" rows={5} required className={`${field} resize-y`} placeholder="A company worth studying, a disagreement, a book…" />
      </label>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          disabled={state === "sending"}
          className="group inline-flex items-center gap-3 border border-ink bg-ink px-6 py-3 text-sm text-paper transition-colors hover:bg-transparent hover:text-ink disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Send the note"}
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
        <p role="status" aria-live="polite" className={`text-sm ${state === "error" ? "text-burgundy" : "text-ink-2"}`}>
          {state === "sent" && (endpoint ? "Thank you — your note has been sent." : "Your email app should now be open with the note ready to send.")}
          {state === "error" && error}
        </p>
      </div>
    </form>
  );
}
