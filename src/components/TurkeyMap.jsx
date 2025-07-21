import React from "react";
import cityPaths from '../constants/data/cityPaths.js';
import cityCenters from '../constants/data/cityCenters.js';
import Tooltip from '@mui/material/Tooltip';

const TurkeyMap = ({ onCitySelect, cityHasPostsMap }) => {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg
        id="svg-turkey-map"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="25 35 20 10"
        style={{ width: "100%", height: "auto" }}
      >
        <defs>
          <filter id="red-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="0.12" flood-color="#fff" flood-opacity="0.7"/>
          </filter>
        </defs>
        <g transform="scale(1,-1) translate(0,-80)">
          {/* Şehir sınırları */}
          {cityPaths.map(city => (
            <path
              key={city.name}
              d={city.d}
              fill="#b6e2c6" // yumuşak yeşil
              stroke="#222" // siyah kenar
              strokeWidth="0.05"
              opacity="0.9"
              style={{ cursor: "pointer" }}
              onClick={() => onCitySelect && onCitySelect(city)}
            />
          ))}
          {/* Şehir merkezlerine noktalar */}
          {cityCenters.map(center => {
            const hasPost = cityHasPostsMap && (cityHasPostsMap[center.name] || cityHasPostsMap[center.dataCityName]);
            return (
              <Tooltip key={center.id + '-center'} title={center.name} placement="top" arrow>
                <circle
                  cx={center.cx}
                  cy={center.cy}
                  r={hasPost ? 0.22 : 0.13}
                  fill={hasPost ? "#e53935" : "#222"}
                  stroke="#fff"
                  strokeWidth={hasPost ? 0.06 : 0.03}
                  style={{ cursor: "pointer" }}
                  filter={hasPost ? "url(#red-glow)" : undefined}
                  onClick={() => onCitySelect && onCitySelect(center)}
                />
              </Tooltip>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default TurkeyMap; 