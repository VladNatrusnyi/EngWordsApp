
import {AppHeader} from "../components/AppHeader";
import {ModulesTab} from "../components/ModulesTab";
import {AppContainer} from "../containers/AppContainer";

export const ModulesPage = () => {
    return (
        <AppContainer>
            <AppHeader title={'EngWordsApp'}/>
            <ModulesTab />
        </AppContainer>
    )
}
