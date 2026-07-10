interface FlagStripProps {
  colors?: [string, string, string, string]; // 👈 Rendu optionnel
}

const FlagStrip = ({ colors }: FlagStripProps) => {
  // 👈 Vérification si colors est undefined ou vide
  if (!colors || !Array.isArray(colors) || colors.length === 0) {
    return null; // Ne rien afficher
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 z-[1001] flex shadow-md">
      {colors.map((color, i) => (
        <div
          key={i}
          className="flex-1"
          style={{ 
            backgroundColor: color,
            animation: `flagPulse 2s ease-in-out infinite`,
            animationDelay: `${i * 0.15}s` 
          }}
        />
      ))}
    </div>
  );
};

export default FlagStrip;