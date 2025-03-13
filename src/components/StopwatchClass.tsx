// Specified imports
import { Component, ClassAttributes } from "react";

// Seconds formatter function
const formattedSeconds = (sec: number) => Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);

interface StopwatchProps extends ClassAttributes<StopwatchClass> {
	initialSeconds: number;
}

// Types for states
interface StopwatchStateTypes {
	secondsElapsed: number;
	lastClearedIncrementer: number | null;
	laps: number[];
}

export class StopwatchClass extends Component<StopwatchProps, StopwatchStateTypes> {
	// Private access to the class.
	// Enforced number type.
	// Initialize as null
	private incrementer: number | null = null;

	constructor(props: StopwatchProps) {
		super(props);

		// Initialize state variables
		this.state = {
			secondsElapsed: props.initialSeconds,
			lastClearedIncrementer: null,
			laps: [],
		};
	}

	// Clear interval on component unmount
	componentWillUnmount() {
		if (this.incrementer) clearInterval(this.incrementer);
	}

	handleStartClick = () => {
		// Start / Continue the timer
		this.incrementer = setInterval(
			() =>
				this.setState((previous) => ({
					secondsElapsed: previous.secondsElapsed + 1,
				})),
			1000
		);
	};

	handleStopClick = () => {
		// Check if incrementer is running
		if (this.incrementer) {
			clearInterval(this.incrementer);

			this.setState({
				lastClearedIncrementer: this.incrementer,
			});
		}
	};

	handleResetClick = () => {
		if (this.incrementer) clearInterval(this.incrementer);

		// Reset completely
		this.setState({
			secondsElapsed: 0,
			laps: [],
		});
	};

	handleLapClick = () => {
		// Using set state to trigger re-render
		this.setState((previous) => ({
			laps: [...previous.laps, previous.secondsElapsed],
		}));
	};

	handleDeleteClick = (index: number) => {
		return () => {
			// Filter out the given index
			this.setState((previous) => ({
				laps: previous.laps.filter((_, i) => index !== i),
			}));
		};
	};

	render() {
		const { secondsElapsed, lastClearedIncrementer, laps } = this.state;

		return (
			<div className="stopwatch">
				<h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>

				{secondsElapsed === 0 || this.incrementer === lastClearedIncrementer ? (
					<button type="button" className="start-btn" onClick={this.handleStartClick}>
						start
					</button>
				) : (
					<button type="button" className="stop-btn" onClick={this.handleStopClick}>
						stop
					</button>
				)}

				{secondsElapsed !== 0 && this.incrementer !== lastClearedIncrementer && (
					<button type="button" onClick={this.handleLapClick}>
						lap
					</button>
				)}

				{secondsElapsed !== 0 && this.incrementer === lastClearedIncrementer && (
					<button type="button" onClick={this.handleResetClick}>
						reset
					</button>
				)}

				<div className="stopwatch-laps">
					{laps &&
						laps.map((lap, i) => (
							<Lap
								key={i}
								index={i + 1}
								lap={lap}
								onDelete={this.handleDeleteClick(i)}
							/>
						))}
				</div>
			</div>
		);
	}
}

// Lap component
const Lap = (props: { index: number; lap: number; onDelete: () => void }) => (
	<div className="stopwatch-lap">
		<strong>{props.index}</strong>/ {formattedSeconds(props.lap)}{" "}
		<button onClick={props.onDelete}> X </button>
	</div>
);
