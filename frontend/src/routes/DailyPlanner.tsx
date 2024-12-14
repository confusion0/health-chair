import { useState, useEffect } from 'react'

interface PlannerItem {
    task: string;
    goal: string;
}

interface Planner {
    items: PlannerItem[];
}

export default function DailyPlanner() {

    useEffect(() => {
        fetch("localhost:1234/generate-planner", {
            method: 'GET',
            credentials: 'include',  // Make sure this line is included
            headers: {
              'Content-Type': 'application/json'
            }
        })
    }, [])

    return (
        <>
            <div 
        </>
    )
}

