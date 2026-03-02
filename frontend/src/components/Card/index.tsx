import "./card.css";

type CardProps = {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
};

export default function Card({ title, children, icon }: CardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          {icon && <span className="card-icon">{icon}</span>}
          <h3>{title}</h3>
        </div>
      </div>

      <div className="card-content">
        {children}
      </div>
    </div>
  );
}
