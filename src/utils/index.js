export const fonts = [
  { label: "Alegreya SC" },
  { label: "Allura" },
  { label: "Anton" },
  { label: "Coiny" },
  { label: "Copse" },
  { label: "DM Serif Text" },
  { label: "Dokdo" },
  { label: "Electrolize" },
  { label: "Faster One" },
  { label: "Flamenco" },
  { label: "Krona One" },
  { label: "Lobster" },
  { label: "Londrina Shadow" },
  { label: "Lora" },
  { label: "Megrim" },
  { label: "Monoton" },
  { label: "MuseoModerno" },
  { label: "Nanum Brush Script" },
  { label: "New Rocker" },
  { label: "Notable" },
  { label: "Open Sans" },
  { label: "Orbitron" },
  { label: "Oxygen" },
  { label: "Parisienne" },
  { label: "Permanent Marker" },
  { label: "Piedra" },
  { label: "Playfair Display" },
  { label: "Poiret One" },
  { label: "Press Start 2P" },
  { label: "PT Sans" },
  { label: "PT Serif" },
  { label: "Ribeye Marrow" },
  { label: "Roboto" },
  { label: "Roboto Condensed" },
  { label: "Roboto Mono" },
  { label: "Rubik" },
  { label: "Rye" },
  { label: "Shadows Into Light" },
  { label: "Six Caps" },
  { label: "Unica One" },
  { label: "Vibes" },
  { label: "Yellowtail" },
];

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
