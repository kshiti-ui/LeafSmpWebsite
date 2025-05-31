import { useEffect, useState } from "react";

interface Leaf {
  id: number;
  x: number;
  y: number;
  rotation: number;
  size: number;
  speed: number;
  delay: number;
  color: string;
}

export default function FallingLeaves() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const leafColors = [
      "hsl(123, 70%, 50%)", // leaf-green
      "hsl(28, 100%, 55%)", // leaf-orange
      "hsl(120, 60%, 40%)", // darker green
      "hsl(30, 80%, 45%)", // darker orange
    ];

    const generateLeaves = () => {
      const newLeaves: Leaf[] = [];
      for (let i = 0; i < 15; i++) {
        newLeaves.push({
          id: i,
          x: Math.random() * 100,
          y: -10,
          rotation: Math.random() * 360,
          size: Math.random() * 15 + 10,
          speed: Math.random() * 3 + 2,
          delay: 0,
          color: leafColors[Math.floor(Math.random() * leafColors.length)]
        });
      }
      setLeaves(newLeaves);
    };

    generateLeaves();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute animate-leaf-fall"
          style={{
            left: `${leaf.x}%`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        >
          <svg
            width={leaf.size}
            height={leaf.size}
            viewBox="0 0 24 24"
            fill="none"
            className="animate-leaf-sway"
            style={{
              color: leaf.color,
              animationDelay: `${leaf.delay * 0.5}s`,
            }}
          >
            <path
              d="M12 2C13.5 4 16 6 16 10C16 12 14 14 12 14C10 14 8 12 8 10C8 6 10.5 4 12 2Z"
              fill="currentColor"
              opacity="0.8"
            />
            <path
              d="M12 2C12 2 14 4 16 6"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.6"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}