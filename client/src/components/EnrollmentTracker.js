// src/components/EnrollmentTracker.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import socket from "../socket"; // ✅ import socket.io client
import "../css/EnrollmentTracker.css";

const EnrollmentTracker = ({
	student,
	steps = [],
	currentStep = 0,
	onStepClick,
	setCurrentStep, // ✅ pass state setter from parent
}) => {
	const navigate = useNavigate();
	const [activeBox, setActiveBox] = useState(null); // track which step box is open

	// 🔹 Listen to socket updates
	useEffect(() => {
		if (!student) return;

		const handleStatusUpdate = (data) => {
			if (data.student_id === student.student_id) {
				console.log("📢 Enrollment status updated via socket:", data);
				if (setCurrentStep) setCurrentStep(data.status); // 🔹 sync step
			}
		};

		socket.on("enrollment-status-updated", handleStatusUpdate);

		return () => {
			socket.off("enrollment-status-updated", handleStatusUpdate);
		};
	}, [student, setCurrentStep]);

	const handleCircleClick = async (i, step) => {
		// Toggle dropdown box
		setActiveBox(activeBox === i ? null : i);

		// Only allow actions for the current step
		if (i !== currentStep) return;

		if (i === 1) {
			navigate("/enroll");
		} else if (i === 2) {
			try {
				await API.put(`/enrollments/status/${student.student_id}`, { status: 3 });
				if (onStepClick) onStepClick(2);
			} catch (err) {
				console.error("Failed to update medical form status", err);
			}
		}
	};

	return (
		<div className="horizontal-tracker" role="list" aria-label="Enrollment steps">
			{steps.map((step, i) => {
				const isCompleted = i < currentStep;
				const isCurrent = i === currentStep;
				const isLast = i === steps.length - 1;

				let circleClass = "";
				if (isCompleted) circleClass = "completed";
				else if (isCurrent) circleClass = "active";

				return (
					<div
						className="step"
						key={i}
						role="listitem"
						style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}
					>
						{/* Circle Icon */}
						<div
							className={`circle ${circleClass} clickable`}
							onClick={() => handleCircleClick(i, step)}
							style={{ cursor: "pointer" }}
						>
              <img
                src={require(`../img/icons/${i + 1}.png`)}
                alt={`Step ${i + 1}`}
              />
						</div>

						{/* Dropdown Box */}
						<div className={`step-dropdown ${activeBox === i ? "open" : ""}`}>
							<p className="details">{step.details}</p>
							{step.link && (
								<a
									href={step.link}
									className="step-link"
									target="_blank"
									rel="noopener noreferrer"
								>
									Go to page
								</a>
							)}
						</div>

						{/* Connector */}
						{!isLast && <div className={`connector ${isCompleted ? "done" : ""}`} />}
					</div>
				);
			})}
		</div>
	);
};

export default EnrollmentTracker;
