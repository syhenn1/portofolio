"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiSend } from "react-icons/fi";
import { socialLinks } from "@/lib/data";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("access_key", "0503ec93-8b8b-47c6-acef-bd52edb53213");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="py-14 px-3 sm:px-5" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="slabel mb-3 justify-center">contact</div>
          <h2 className="text-3xl sm:text-5xl font-black">
            Let&apos;s <span className="gtx">Connect</span>
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Ada project seru atau mau ngobrol? Jangan ragu, reach out!</p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto grid md:grid-cols-5 gap-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="md:col-span-2 flex flex-col gap-4">
            <a href={`mailto:${socialLinks.email}`} className="cl">
              <div
                style={{
                  width: 42, height: 42, background: "rgba(16,185,129,.1)", borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                <FiMail size={20} style={{ color: "var(--em)" }} />
              </div>
              <div>
                <p className="mono text-xs mb-0.5" style={{ color: "var(--em)" }}>email</p>
                <p className="text-sm text-gray-300 font-medium">{socialLinks.email}</p>
              </div>
            </a>
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="cl">
              <div
                style={{
                  width: 42, height: 42, background: "rgba(16,185,129,.1)", borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                <FiGithub size={20} style={{ color: "var(--em)" }} />
              </div>
              <div>
                <p className="mono text-xs mb-0.5" style={{ color: "var(--em)" }}>github</p>
                <p className="text-sm text-gray-300 font-medium">
                  {socialLinks.github.replace("https://", "")}
                </p>
              </div>
            </a>
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="cl">
              <div
                style={{
                  width: 42, height: 42, background: "rgba(6,182,212,.1)", borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                <FiLinkedin size={20} style={{ color: "#06b6d4" }} />
              </div>
              <div>
                <p className="mono text-xs mb-0.5" style={{ color: "#06b6d4" }}>linkedin</p>
                <p className="text-sm text-gray-300 font-medium">
                  {socialLinks.linkedin.replace("https://", "").replace(/\/$/, "")}
                </p>
              </div>
            </a>
          </div>

          <div className="md:col-span-3">
            <div className="bcard" style={{ borderColor: "rgba(16,185,129,.14)" }}>
              <p className="mono text-xs mb-5" style={{ color: "var(--em)" }}>
                // send_message()
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="checkbox" name="botcheck" style={{ display: "none" }} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mono text-xs mb-1.5" style={{ color: "var(--muted)" }}>nama</label>
                    <input type="text" name="name" placeholder="Nama Anda" required className="ff" />
                  </div>
                  <div>
                    <label className="block mono text-xs mb-1.5" style={{ color: "var(--muted)" }}>email</label>
                    <input type="email" name="email" placeholder="email@example.com" required className="ff" />
                  </div>
                </div>
                <div>
                  <label className="block mono text-xs mb-1.5" style={{ color: "var(--muted)" }}>pesan</label>
                  <textarea name="message" rows={5} placeholder="Tulis pesan kamu..." required className="ff" style={{ resize: "none" }} />
                </div>
                <button type="submit" disabled={status === "sending"} className="btn-em w-full justify-center">
                  <FiSend size={16} />
                  {status === "sending" ? "Mengirim..." : "Kirim Pesan"}
                </button>
                {status === "success" && (
                  <p className="text-sm" style={{ color: "var(--em2)" }}>
                    Pesan terkirim! Terima kasih, akan saya balas secepatnya.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-sm" style={{ color: "#f87171" }}>
                    Gagal mengirim pesan. Coba lagi atau email langsung ya.
                  </p>
                )}
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
