import { forwardRef } from 'react';

// Architectural Modular Kitchen CAD Blueprint SVG
// Matches Concept Reference: Warm champagne-bronze technical perspective drafting lines
const KitchenBlueprint = forwardRef(function KitchenBlueprint(_, ref) {
  return (
    <div
      ref={ref}
      className="kh-blueprint-stage absolute inset-0 flex flex-col items-center justify-center px-6 pointer-events-none"
      aria-hidden="true"
    >
      {/* Top Architectural Drafting Caption */}
      <div className="kh-cad-caption mb-4 sm:mb-6 flex items-center gap-3 opacity-0">
        <span className="h-px w-6 sm:w-10 bg-bronze/70" />
        <p className="font-body text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.28em] text-carbon/70">
          Precision in Every Detail
        </p>
        <span className="h-px w-6 sm:w-10 bg-bronze/70" />
      </div>

      {/* Main Perspective Modular Kitchen CAD Drawing */}
      <svg
        viewBox="0 0 640 340"
        className="kh-cad-svg w-full max-w-[340px] sm:max-w-[520px] md:max-w-[620px] h-auto overflow-visible"
        fill="none"
      >
        {/* Subtle Architectural Dimension & Measurement Lines */}
        <g className="kh-cad-dimensions" stroke="#B39A7D" strokeWidth="0.8" opacity="0.65">
          {/* Top horizontal width dimension */}
          <line className="kh-draw-line" x1="90" y1="22" x2="550" y2="22" />
          <line className="kh-draw-line" x1="90" y1="16" x2="90" y2="28" />
          <line className="kh-draw-line" x1="550" y1="16" x2="550" y2="28" />
          {/* Left vertical height dimension */}
          <line className="kh-draw-line" x1="62" y1="68" x2="62" y2="262" />
          <line className="kh-draw-line" x1="56" y1="68" x2="68" y2="68" />
          <line className="kh-draw-line" x1="56" y1="262" x2="68" y2="262" />
          {/* Dashed center datum guides */}
          <line
            className="kh-guide-converge"
            x1="320"
            y1="8"
            x2="320"
            y2="325"
            strokeDasharray="4 4"
            opacity="0.45"
          />
          <line
            className="kh-guide-converge"
            x1="40"
            y1="170"
            x2="600"
            y2="170"
            strokeDasharray="4 4"
            opacity="0.45"
          />
        </g>

        {/* Perspective Depth Side & Top Plane */}
        <g className="kh-cad-shell" stroke="#B39A7D" strokeWidth="1.15">
          <polyline className="kh-draw-line" points="90,68 128,42 550,42 512,68" />
          <polyline className="kh-draw-line" points="550,42 550,236 512,262" />
          <line className="kh-draw-line" x1="90" y1="68" x2="90" y2="262" />
          <line className="kh-draw-line" x1="512" y1="68" x2="512" y2="262" />
        </g>

        {/* Upper Wall Cabinets (slide downward during Phase 2 assembly) */}
        <g className="kh-cad-upper" stroke="#B39A7D" strokeWidth="1.2">
          <rect className="kh-draw-line" x="90" y="68" width="422" height="86" />
          <line className="kh-draw-line" x1="195" y1="68" x2="195" y2="154" />
          <line className="kh-draw-line" x1="301" y1="68" x2="301" y2="154" />
          <line className="kh-draw-line" x1="406" y1="68" x2="406" y2="154" />
          {/* Integrated Built-In Appliance Outline in Right Tall Bay */}
          <rect
            className="kh-cad-appliance kh-draw-line"
            x="420"
            y="84"
            width="78"
            height="54"
            strokeDasharray="3 2"
          />
          <line className="kh-cad-appliance kh-draw-line" x1="430" y1="96" x2="488" y2="96" />
        </g>

        {/* Backsplash & Countertop Alignment Datum */}
        <g className="kh-cad-countertop" stroke="#B39A7D" strokeWidth="1.25">
          <line className="kh-draw-line" x1="90" y1="154" x2="512" y2="154" />
          <line className="kh-draw-line" x1="90" y1="184" x2="512" y2="184" />
          {/* Countertop slab lip */}
          <rect className="kh-draw-line" x="90" y="184" width="422" height="8" />
        </g>

        {/* Base Cabinets (rise smoothly upward during Phase 2 assembly) */}
        <g className="kh-cad-base" stroke="#B39A7D" strokeWidth="1.2">
          <rect className="kh-draw-line" x="90" y="192" width="422" height="70" />
          <line className="kh-draw-line" x1="195" y1="192" x2="195" y2="262" />
          <line className="kh-draw-line" x1="301" y1="192" x2="301" y2="262" />
          <line className="kh-draw-line" x1="406" y1="192" x2="406" y2="262" />
          {/* Drawer horizontal division lines */}
          <line className="kh-draw-line" x1="195" y1="224" x2="406" y2="224" />
        </g>

        {/* Foreground Perspective Kitchen Island */}
        <g className="kh-cad-island" stroke="#B39A7D" strokeWidth="1.25">
          {/* Top slab perspective trapezoid */}
          <polygon className="kh-draw-line" points="168,214 390,214 468,252 246,252" />
          {/* Front vertical island face */}
          <rect className="kh-draw-line" x="246" y="252" width="222" height="58" />
          {/* Left perspective island face */}
          <polygon className="kh-draw-line" points="168,214 246,252 246,310 168,272" />
          {/* Flush cooktop outline on island */}
          <polygon
            className="kh-cad-appliance kh-draw-line"
            points="272,224 342,224 360,236 290,236"
          />
        </g>
      </svg>
    </div>
  );
});

export default KitchenBlueprint;
