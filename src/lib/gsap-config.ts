import gsap from "gsap";

export function registerGsapPlugins(...plugins: object[]) {
  gsap.registerPlugin(...plugins);
  return gsap;
}

export { gsap };
