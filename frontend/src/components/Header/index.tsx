import { useContext } from "react";
import { DevContext } from "../../context/DevContext";
import "./header.css";

export default function Header() {
  const { xp, level } = useContext(DevContext);
  const xpPerLevel = 100;
  const currentLevelXp = (level - 1) * xpPerLevel;
  const nextLevelXp = level * xpPerLevel;
  const xpInLevel = xp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;
  const progressPercent = (xpInLevel / xpNeeded) * 100;

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <h1>Dev Dashboard</h1>
          <p>Acompanhe seu progresso como desenvolvedor</p>
        </div>

        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon level-icon">⭐</div>
            <div className="stat-info">
              <p className="stat-label">Nível</p>
              <h3 className="stat-value">{level}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon xp-icon">🎯</div>
            <div className="stat-info">
              <p className="stat-label">Experiência</p>
              <h3 className="stat-value">{xp} XP</h3>
            </div>
          </div>

          <div className="stat-card xp-progress">
            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="progress-text">
                {xpInLevel} / {xpNeeded} XP
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
