"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const VIBES = ["Warm & Cozy", "Bold & Urban", "Elegant & Refined", "Rustic & Earthy"];
const OCCASIONS = ["Birthday", "Housewarming", "Thank You", "Date Night", "Holiday", "Just Because"];

export default function BasketGeneratorForm() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [vibe, setVibe] = useState("");
  const [occasion, setOccasion] = useState("");
  const [budget, setBudget] = useState("$75–$125");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, route to reveal with demo data
    router.push("/reveal");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Location */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-warmgray-600 tracking-wide uppercase">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="San Francisco, CA"
          className="w-full px-4 py-3 bg-white/60 border border-warmgray-200 rounded-lg
                     text-warmgray-800 placeholder:text-warmgray-400
                     focus:outline-none focus:ring-1 focus:ring-accent-gold/50 focus:border-accent-gold/50
                     transition-all duration-200"
        />
      </div>

      {/* Vibe */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-warmgray-600 tracking-wide uppercase">
          Vibe
        </label>
        <div className="grid grid-cols-2 gap-2">
          {VIBES.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVibe(v)}
              className={`px-4 py-2.5 rounded-lg border text-sm transition-all duration-200 ${
                vibe === v
                  ? "border-accent-gold bg-accent-gold/10 text-warmgray-800"
                  : "border-warmgray-200 bg-white/40 text-warmgray-500 hover:border-warmgray-300"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Occasion */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-warmgray-600 tracking-wide uppercase">
          Occasion
        </label>
        <div className="grid grid-cols-3 gap-2">
          {OCCASIONS.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setOccasion(o)}
              className={`px-3 py-2.5 rounded-lg border text-sm transition-all duration-200 ${
                occasion === o
                  ? "border-accent-gold bg-accent-gold/10 text-warmgray-800"
                  : "border-warmgray-200 bg-white/40 text-warmgray-500 hover:border-warmgray-300"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-warmgray-600 tracking-wide uppercase">
          Budget
        </label>
        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full px-4 py-3 bg-white/60 border border-warmgray-200 rounded-lg
                     text-warmgray-800
                     focus:outline-none focus:ring-1 focus:ring-accent-gold/50 focus:border-accent-gold/50
                     transition-all duration-200 appearance-none"
        >
          <option>$50–$75</option>
          <option>$75–$125</option>
          <option>$125–$200</option>
          <option>$200+</option>
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3.5 bg-warmgray-800 text-parchment rounded-lg
                   font-medium tracking-wide text-sm
                   hover:bg-warmgray-900 transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-warmgray-800/50 focus:ring-offset-2 focus:ring-offset-parchment"
      >
        Generate My Basket
      </button>
    </motion.form>
  );
}
