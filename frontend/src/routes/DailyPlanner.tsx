import { useContext, useState, useEffect } from 'react'

import SiteHeader from '../components/SiteHeader';
import AuthTokenContext from '../AuthTokenContext';

import { RiArrowDownWideLine } from "react-icons/ri";

interface PlannerItem {
    task: string;
    goal: string;
}

export default function DailyPlanner() {
    const [planner, setPlanner] = useState<PlannerItem[]>([]);
    const [expandedItems, setExpandedItems] = useState<number | null>(null);
    const { token } = useContext(AuthTokenContext);

    const fetchPersonalPlanner = async () => {
        const response = await fetch("http://localhost:1234/generate-planner", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        if (!response.ok) return

        const data = await response.json()

        let items: PlannerItem[] = []

        data.checklist.forEach((item: PlannerItem) => {
            items.push(item)
        })

        setPlanner(items)
    }

    useEffect(() => {
        fetchPersonalPlanner()
    }, [])

    const toggleExpand = (index: number) => {
        setExpandedItems((prev) => (prev === index ? null : index));
    };

    return (
        <>
            <div className="planner-container">
                <SiteHeader />

                <div className="checklist-container">
                    {planner.length !== 0 ? planner.map((item, index) => (
                        <div className="checklist-item" key={item.task}>
                            <div className="checklist-header">
                                <input type="checkbox" />

                                <div className="checklist-heading"
                                    onClick={() => toggleExpand(index)}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        cursor: "pointer",
                                    }}
                                >
                                    <h2>{item.task}</h2>
                                    
                                    <div style={{transform: expandedItems === index ? "rotate(180deg)" : "rotate(0)" }}>
                                        <RiArrowDownWideLine color="black" />
                                    </div>
                                </div>
                            </div>

                            {expandedItems === index && (
                                <p className="checklist-description" style={{ marginTop: "10px" }}>
                                    {item.goal}
                                </p>
                            )}
                        </div>
                    )) : 
                    <h2>Loading...</h2>}
                </div>
            </div>
        </>
    )
}

