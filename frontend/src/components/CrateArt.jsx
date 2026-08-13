export default function CrateArt() {
  return (
    <svg viewBox="0 0 420 380" className="w-full h-auto max-w-md mx-auto" role="img" aria-label="Illustration of a wooden crate filled with fresh vegetables">
      {/* crate body */}
      <rect x="40" y="220" width="340" height="130" rx="6" fill="#DDD7C1" stroke="#8B6F47" strokeWidth="3" />
      <line x1="40" y1="255" x2="380" y2="255" stroke="#8B6F47" strokeWidth="3" />
      <line x1="40" y1="315" x2="380" y2="315" stroke="#8B6F47" strokeWidth="3" />
      <line x1="130" y1="220" x2="130" y2="350" stroke="#8B6F47" strokeWidth="3" />
      <line x1="290" y1="220" x2="290" y2="350" stroke="#8B6F47" strokeWidth="3" />
      <rect x="150" y="270" width="120" height="30" rx="3" fill="#EAE6D6" stroke="#8B6F47" strokeWidth="2" />
      <text x="210" y="291" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="13" fill="#1F2B1A">VEGITALE</text>

      {/* carrot */}
      <g transform="translate(75,80) rotate(-8)">
        <path d="M20 0C30 40 30 90 12 130L0 130C-8 90 0 40 20 0Z" fill="#E3A72C" />
        <path d="M8 0 L4 -28 M14 0 L14 -30 M20 0 L26 -26" stroke="#2F5233" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* tomato */}
      <g transform="translate(190,60)">
        <circle cx="0" cy="40" r="42" fill="#7A2E3A" />
        <path d="M-14 5 C -4 -8 4 -8 14 5" stroke="#2F5233" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="0" cy="2" r="6" fill="#2F5233" />
      </g>

      {/* leafy green bunch */}
      <g transform="translate(300,60)">
        <path d="M0 130 C -10 90 -30 70 -35 30 C -10 45 0 65 5 90 C 15 55 10 25 -5 0 C 20 20 30 55 20 95 C 35 65 45 45 65 35 C 55 75 35 95 25 125Z" fill="#2F5233" />
      </g>

      {/* leaves peeking from crate */}
      <path d="M110 225 C 100 200 105 180 125 165 C 128 190 122 210 110 225Z" fill="#2F5233" />
      <path d="M310 225 C 320 195 315 175 295 160 C 290 188 296 210 310 225Z" fill="#2F5233" />
    </svg>
  )
}
