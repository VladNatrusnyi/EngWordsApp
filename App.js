import {AppNavigator} from "./src/navigation/AppNavigator";
import {Provider} from "react-redux";
import {store} from "./src/store";

const App = () => {
    return (
        <Provider store={store}>
            <AppNavigator />
        </Provider>
    )
};


export default App;
