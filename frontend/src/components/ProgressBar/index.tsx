import "./progressbar.css";

type ProgressBarProps = {
    value: number;
    label?: string;
};

export default function ProgressBar({ value, label }: ProgressBarProps) {
    return (
        <div className="progress-container">
            {label && (
                <div className="progress-header">
                    <span>{label}</span>
                    <span>{value}%</span>
                </div>
            )}

            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}
