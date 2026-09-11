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
    name: "GameBoy / GameBoy Color / GameBoy Advance Emulator",
    description: "A Rust-based multi-system emulator currently under development.",
    technologies: ["Rust", "Emulation", "Low-level", "Systems"],
    status: "In development",
    // Replace this with the public repository URL when you publish it.
    url: "#",
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
