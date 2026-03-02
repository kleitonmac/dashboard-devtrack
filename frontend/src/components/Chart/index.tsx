import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { FiTrendingUp } from "react-icons/fi";
import "./chart.css";

export default function Chart({ data: propData }: { data?: any[] }) {
    const data = propData || [
        { name: "Seg", xp: 30 },
        { name: "Ter", xp: 45 },
        { name: "Qua", xp: 60 },
        { name: "Qui", xp: 40 },
        { name: "Sex", xp: 80 },
        { name: "Sáb", xp: 50 },
        { name: "Dom", xp: 90 },
    ];

    return (
        <div className="chart-wrapper">
            <h3><FiTrendingUp style={{ verticalAlign: 'middle', marginRight: 8 }} /> Evolução Semanal de XP</h3>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(13, 148, 136, 0.2)" />
                    <XAxis 
                        dataKey="name" 
                        stroke="var(--text-secondary)"
                        style={{ fontSize: "0.9rem" }}
                    />
                    <YAxis 
                        stroke="var(--text-secondary)"
                        style={{ fontSize: "0.9rem" }}
                    />
                    <Tooltip 
                        contentStyle={{
                            backgroundColor: "var(--bg-tertiary)",
                            border: "1px solid var(--primary)",
                            borderRadius: "0.5rem",
                            color: "var(--text-primary)",
                        }}
                        cursor={{ stroke: "#0d9488", strokeDasharray: "5 5" }}
                    />
                    <Legend 
                        wrapperStyle={{
                            paddingTop: "1rem",
                            color: "var(--text-secondary)",
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="xp"
                        stroke="#0d9488"
                        strokeWidth={3}
                        dot={{ fill: "#0d9488", r: 5 }}
                        activeDot={{ r: 7 }}
                        name="XP Ganho"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

