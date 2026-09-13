export type Project = {
  name: string;
  description: string;
  technologies: string[];
  status: string;
  url: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    name: "GameBoy / GameBoy Color Emulator",
    description: "Game Boy and Game Boy Color emulator written in Rust with SDL2 video/audio, cartridge support, save files, and headless mode.",
    technologies: ["Rust", "Emulation", "Low-level", "Systems"],
    status: "Finished",
    url: "https://github.com/yunekoto-dev/gameboy-emulator",
    featured: true
  },
  {
    name: "PROJECT_02",
    description: "",
    technologies: [],
    status: "Coming soon",
    url: "#",
    featured: false
  },
  {
    name: "PROJECT_03",
    description: "",
    technologies: [],
    status: "Coming soon",
    url: "#",
    featured: false
  }
];
