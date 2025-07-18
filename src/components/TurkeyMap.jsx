import React from "react";
import cityPaths from '../constants/data/cityPaths.js';
import cityCenters from '../constants/data/cityCenters.js';

const TurkeyMap = ({ onCitySelect }) => {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg
        id="svg-turkey-map"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="25 35 20 10"
        style={{ width: "100%", height: "auto" }}
      >
        <g>
          {/* Şehir sınırları */}
          {cityPaths.map(city => (
            <path
              key={city.name}
              d={city.d}
              fill="#b3d1f7"
              stroke="#0a2342"
              strokeWidth="0.05"
              opacity="0.9"
              style={{ cursor: "pointer" }}
              onClick={() => onCitySelect && onCitySelect(city)}
            />
          ))}
          {/* Şehir merkezlerine noktalar */}
          {cityCenters.map(center => (
            <circle
              key={center.id + '-center'}
              cx={center.cx}
              cy={center.cy}
              r={0.13}
              fill="#0a2342"
              stroke="#fff"
              strokeWidth="0.03"
              style={{ cursor: "pointer" }}
              onClick={() => onCitySelect && onCitySelect(center)}
            >
              <title>{center.name}</title>
            </circle>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default TurkeyMap; 