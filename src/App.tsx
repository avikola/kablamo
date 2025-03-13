import "./styles/App.css";

import { StopwatchClass } from "./components/StopwatchClass";
import StopwatchFunctional from "./components/StopwatchFunctional";

function App() {
	return (
		<>
			<StopwatchClass initialSeconds={0} />
			<StopwatchFunctional initialSeconds={0} />
		</>
	);
}

export default App;
