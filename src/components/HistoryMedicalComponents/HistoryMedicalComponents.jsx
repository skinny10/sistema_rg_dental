import React from "react";
import PatientHistoryManager from "../medical-history/PatientHistoryManager";


export default function HistoryMedicalComponents() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <PatientHistoryManager />
        </div>
    );
}