import { useState, useEffect, useCallback } from "react";

// Seconds formatter function
const formattedSeconds = (sec: number) => Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);

interface StopwatchProps {
	initialSeconds: number;
}

const StopwatchFunctional = ({ initialSeconds }: StopwatchProps) => {
	// State for seconds elapsed
	const [secondsElapsed, setSecondsElapsed] = useState(initialSeconds);

	// State for laps
	const [laps, setLaps] = useState<number[]>([]);

	// State for the incrementer
	const [incrementer, setIncrementer] = useState<number | null>(null);

	// Start / continue timer
	const handleStartClick = useCallback(() => {
		if (incrementer !== null) return;

		const intervalId = setInterval(() => {
			setSecondsElapsed((previous) => previous + 1);
		}, 1000);

		setIncrementer(intervalId);
	}, [incrementer]);

	// Stop the timer
	const handleStopClick = useCallback(() => {
		if (incrementer) {
			clearInterval(incrementer);
			setIncrementer(null);
		}
	}, [incrementer]);

	// Reset
	const handleResetClick = useCallback(() => {
		if (incrementer) clearInterval(incrementer);

		setSecondsElapsed(0);
		setLaps([]);
		setIncrementer(null);
	}, [incrementer]);

	// Record Lap
	const handleLapClick = useCallback(() => {
		setLaps((previousLaps) => [...previousLaps, secondsElapsed]);
	}, [secondsElapsed]);

	// Delete Lap
	const handleDeleteClick = useCallback(
		(index: number) => () => {
			setLaps((previousLaps) => previousLaps.filter((_, i) => index !== i));
		},
		[]
	);

	// Clear interval on component unmount
	useEffect(() => {
		return () => {
			if (incrementer) clearInterval(incrementer);
		};
	}, [incrementer]);

	return (
		<div className="stopwatch">
			<h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>

			{secondsElapsed === 0 || incrementer === null ? (
				<button type="button" className="start-btn" onClick={handleStartClick}>
					start
				</button>
			) : (
				<button type="button" className="stop-btn" onClick={handleStopClick}>
					stop
				</button>
			)}

			{secondsElapsed !== 0 && incrementer !== null && (
				<button type="button" onClick={handleLapClick}>
					lap
				</button>
			)}

			{secondsElapsed !== 0 && incrementer === null && (
				<button type="button" onClick={handleResetClick}>
					reset
				</button>
			)}

			<div className="stopwatch-laps">
				{laps &&
					laps.map((lap, i) => (
						<Lap key={i} index={i + 1} lap={lap} onDelete={handleDeleteClick(i)} />
					))}
			</div>
		</div>
	);
};

// Lap component
const Lap = ({ index, lap, onDelete }: { index: number; lap: number; onDelete: () => void }) => (
	<div className="stopwatch-lap">
		<strong>{index}</strong>/ {formattedSeconds(lap)} <button onClick={onDelete}> X </button>
	</div>
);

export default StopwatchFunctional;
