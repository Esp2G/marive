"use client";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { Theme } from "@/lib/types";
import { LiveIndicator } from "./LiveIndicator";
import { TextShine } from "./ui/TextShine";

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
  isConnected: boolean;
}

export function Navbar({ theme, onToggleTheme, isConnected }: NavbarProps) {
  return (
    <nav
      className="floating-nav flex items-center justify-between px-5 py-3 shrink-0 z-20 relative"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center text-[var(--accent)]">
          <svg
            className="w-7 h-7"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 179.006 179.006"
            xmlSpace="preserve"
            fill="currentColor"
          >
            <g><g><g>
              <path fill="currentColor" d="M132.017,94.709H21.88v6.778h103.716C127.84,99.244,129.97,96.977,132.017,94.709z"/>
              <path fill="currentColor" d="M158.88,39.259H21.88v51.56h113.55C151.314,72.017,160.073,52.977,158.88,39.259z M124.588,77.238c-2.989,1.85-6.623,3.353-10.716,4.41c-4.111,1.05-8.652,1.635-13.449,1.635c-4.779,0-9.32-0.585-13.425-1.641c-4.081-1.05-7.715-2.554-10.711-4.404c-2.966-1.832-5.293-3.992-6.82-6.373c-1.516-2.345-2.232-4.893-2.011-7.53c0.221-2.602,1.331-5.042,3.145-7.244c1.802-2.178,4.29-4.111,7.28-5.722c2.966-1.605,6.444-2.882,10.251-3.765c3.795-0.877,7.948-1.366,12.286-1.366c4.35,0,8.503,0.483,12.31,1.366c3.807,0.883,7.292,2.166,10.257,3.765c3.001,1.611,5.49,3.544,7.292,5.722c1.826,2.202,2.924,4.642,3.139,7.244c0.221,2.637-0.489,5.185-2.005,7.53C129.887,73.246,127.554,75.412,124.588,77.238z"/>
              <path fill="currentColor" d="M122.458,104.501H21.88v6.784h93.077C117.553,109.048,120.059,106.786,122.458,104.501z"/>
              <path fill="currentColor" d="M158.247,90.807h20.759V52.69C175.772,64.165,168.671,77.322,158.247,90.807z"/>
              <path fill="currentColor" d="M140.048,111.273h38.958v-6.784h-32.4C144.512,106.768,142.31,109.024,140.048,111.273z"/>
              <path fill="currentColor" d="M129.618,121.071h49.388v-6.772h-42.043C134.595,116.572,132.142,118.833,129.618,121.071z"/>
              <path fill="currentColor" d="M149.297,101.488h29.709v-6.778h-23.927C153.241,96.965,151.314,99.226,149.297,101.488z"/>
              <path fill="currentColor" d="M111.407,114.298H21.88v6.772h80.684C105.53,118.923,108.478,116.691,111.407,114.298z"/>
              <path fill="currentColor" d="M122.619,127.073c-1.599,1.313-3.216,2.53-4.821,3.789h61.208v-6.778h-52.908C124.934,125.081,123.812,126.095,122.619,127.073z"/>
              <path fill="currentColor" d="M98.328,124.09H21.874v6.778h65.683C91.132,128.786,94.724,126.548,98.328,124.09z"/>
            </g>
            <path fill="currentColor" d="M169.107,22.033c-7.858-9.565-24.106-10.722-44.03-4.881c9.762-0.37,17.632,2.059,22.31,7.751c13.867,16.898-5.215,55.504-42.633,86.245c-37.418,30.729-79.007,41.965-92.868,25.067c-4.678-5.692-5.531-13.891-3.276-23.39c-9.607,18.414-11.623,34.578-3.765,44.137c15.77,19.207,65.331,4.577,110.697-32.692C160.891,87.018,184.877,41.246,169.107,22.033z"/>
            </g></g>
          </svg>
        </div>
        <TextShine className="text-sm font-bold tracking-tight">
          Market Live
        </TextShine>
      </div>

      {/* Center — live indicator */}
      <LiveIndicator isLive={isConnected} />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={onToggleTheme}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/[0.06]"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Sun size={15} style={{ color: "var(--text-secondary)" }} />
          ) : (
            <Moon size={15} style={{ color: "var(--text-secondary)" }} />
          )}
        </motion.button>
      </div>
    </nav>
  );
}
