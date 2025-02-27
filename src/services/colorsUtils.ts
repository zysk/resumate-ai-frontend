export const colors = [
  "#FFE59A", // Light Yellow
    "#FFC6A5", // Light Red
    "#AEDFFF", // Light Blue
    "#A2E3E0", // Light Teal
    "#D1BBE4", // Light Purple
    "#FFD8B8", // Light Orange
    "#F5B7B1", // Light Crimson
    "#C5B3F2", // Light Indigo
    "#A4EFA1", // Light Green
    "#FFADE9", // Light Deep Pink
    "#FFE382", // Light Gold
    "#9ED8D5", // Light Sea Green
    "#FFA8A4", // Light Tomato
    "#D5A0E6", // Light Lavender
    "#FFBBCC", // Light Hot Pink
    "#FFC09F", // Light Coral
    "#A2B9D4", // Light Steel Blue
    "#A8D8D8", // Light Teal
    "#F08080", // Light Coral
  ];

// Function to generate darker shades
const generateDarkerShades = (colorsArray: any, step: number) => {
    const darkerShades = colorsArray.map((color: any) => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
  
      const darken = (channel: any) => Math.max(0, channel - step);
  
      const newColor = `#${darken(r).toString(16).padStart(2, '0')}${darken(g).toString(16).padStart(2, '0')}${darken(b).toString(16).padStart(2, '0')}`;
      return newColor;
    });
  
    return darkerShades;
  };
  
  const darkerShades = generateDarkerShades(colors, 20); // Adjust the step value for darker shades
  export const ChipColors = colors.map((lightColor, index) => ({
    lightColor,
    darkColor: darkerShades[index],
  }));