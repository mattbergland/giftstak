"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { BasketData } from "@/lib/basket-data";

const TABS = ["Overview", "Ingredients", "Sources", "Assembly", "Concierge"] as const;
type Tab = (typeof TABS)[number];

interface ResultTabsProps {
  basket: BasketData;
}

export default function ResultTabs({ basket }: ResultTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  return (
    <div className="w-full">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-warmgray-200 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              relative px-4 py-2.5 text-sm tracking-wide transition-colors duration-200
              ${
                activeTab === tab
                  ? "text-warmgray-800 font-medium"
                  : "text-warmgray-400 hover:text-warmgray-600"
              }
            `}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-px bg-warmgray-800"
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "Overview" && <OverviewTab basket={basket} />}
        {activeTab === "Ingredients" && <IngredientsTab basket={basket} />}
        {activeTab === "Sources" && <SourcesTab basket={basket} />}
        {activeTab === "Assembly" && <AssemblyTab />}
        {activeTab === "Concierge" && <ConciergeTab />}
      </motion.div>
    </div>
  );
}

function OverviewTab({ basket }: { basket: BasketData }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl text-warmgray-800 mb-2">{basket.basketName}</h3>
        <p className="text-warmgray-500 leading-relaxed">{basket.description}</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/50 rounded-lg p-4 border border-warmgray-100">
          <p className="text-[10px] uppercase tracking-widest text-warmgray-400 mb-1">Items</p>
          <p className="font-serif text-2xl text-warmgray-800">{basket.zones.length}</p>
        </div>
        <div className="bg-white/50 rounded-lg p-4 border border-warmgray-100">
          <p className="text-[10px] uppercase tracking-widest text-warmgray-400 mb-1">Regions</p>
          <p className="font-serif text-2xl text-warmgray-800">
            {new Set(basket.zones.map((z) => z.sourceRegion)).size}
          </p>
        </div>
        <div className="bg-white/50 rounded-lg p-4 border border-warmgray-100">
          <p className="text-[10px] uppercase tracking-widest text-warmgray-400 mb-1">Categories</p>
          <p className="font-serif text-2xl text-warmgray-800">
            {new Set(basket.zones.map((z) => z.category)).size}
          </p>
        </div>
      </div>
    </div>
  );
}

function IngredientsTab({ basket }: { basket: BasketData }) {
  return (
    <div className="space-y-3">
      {basket.zones.map((zone) => (
        <div
          key={zone.id}
          className="flex items-start gap-4 p-4 bg-white/50 rounded-lg border border-warmgray-100"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-warmgray-100 flex items-center justify-center">
            <span className="text-xs font-medium text-warmgray-600">{zone.number}</span>
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest text-accent-gold mb-0.5">
              {zone.category}
            </p>
            <h4 className="font-serif text-base text-warmgray-800">{zone.itemName}</h4>
            <p className="text-xs text-warmgray-500 mt-0.5">{zone.brand}</p>
            <p className="text-sm text-warmgray-500 mt-1.5 leading-relaxed">{zone.rationale}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SourcesTab({ basket }: { basket: BasketData }) {
  const regions = Array.from(new Set(basket.zones.map((z) => z.sourceRegion)));

  return (
    <div className="space-y-4">
      <p className="text-warmgray-500 text-sm leading-relaxed">
        Every ingredient is sourced from trusted local producers across the region.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {regions.map((region) => {
          const items = basket.zones.filter((z) => z.sourceRegion === region);
          return (
            <div key={region} className="p-4 bg-white/50 rounded-lg border border-warmgray-100">
              <h4 className="font-serif text-base text-warmgray-800 mb-2">{region}</h4>
              {items.map((item) => (
                <p key={item.id} className="text-xs text-warmgray-500">
                  {item.brand} — {item.itemName}
                </p>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AssemblyTab() {
  return (
    <div className="space-y-4">
      <p className="text-warmgray-500 text-sm leading-relaxed">
        Your basket is assembled by hand with care and attention to presentation.
      </p>
      <div className="space-y-3">
        {[
          { step: 1, title: "Selection", desc: "Ingredients sourced from local artisan producers" },
          { step: 2, title: "Quality Check", desc: "Each item inspected for freshness and quality" },
          { step: 3, title: "Arrangement", desc: "Carefully composed in our signature gift box" },
          { step: 4, title: "Finishing", desc: "Wrapped with branded ribbon and tasting notes" },
          { step: 5, title: "Delivery", desc: "Hand-delivered or shipped with temperature control" },
        ].map((item) => (
          <div
            key={item.step}
            className="flex gap-4 items-start p-3 bg-white/50 rounded-lg border border-warmgray-100"
          >
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-warmgray-100 flex items-center justify-center">
              <span className="text-xs font-medium text-warmgray-600">{item.step}</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-warmgray-800">{item.title}</h4>
              <p className="text-xs text-warmgray-500 mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConciergeTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-xl text-warmgray-800 mb-2">
          Request This as a Delivered Gift
        </h3>
        <p className="text-warmgray-500 text-sm leading-relaxed">
          Love what you see? Our concierge team can source, assemble, and deliver this exact basket
          — or customize it further to your taste.
        </p>
      </div>
      <button
        className="px-6 py-3 bg-warmgray-800 text-parchment rounded-lg
                   font-medium tracking-wide text-sm
                   hover:bg-warmgray-900 transition-colors duration-200"
      >
        Contact Concierge
      </button>
      <div className="pt-4 border-t border-warmgray-200">
        <p className="text-xs text-warmgray-400">
          Typical lead time: 3–5 business days · Bay Area delivery included · Custom requests welcome
        </p>
      </div>
    </div>
  );
}
