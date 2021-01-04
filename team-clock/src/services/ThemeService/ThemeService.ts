import * as microsoftTeams from "@microsoft/teams-js";
import {
    ThemePrepared,
    teamsTheme,
    teamsDarkTheme,
    teamsHighContrastTheme
} from '@fluentui/react-northstar';

// Service to map Teams themes to Fluent UI themes
export default class ThemeService {

    static getFluentTheme(theme: string = "default"): ThemePrepared {
        let result = teamsTheme;
        if (theme === 'dark') result = teamsDarkTheme;
        if (theme === 'contrast') result = teamsHighContrastTheme
        return result;
    }

    static registerOnThemeChangeHandler(callback: (theme: ThemePrepared) => void) {

        microsoftTeams.registerOnThemeChangeHandler(
            (theme: string = "default"): void => {
                callback(this.getFluentTheme(theme));
            });

    };

}
