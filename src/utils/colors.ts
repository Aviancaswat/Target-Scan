import { theme } from "./theme";

export const getColor = () => {
    const colorOptions: [string, string][] = [
        // [blueGrey[100], blueGrey[700]],
        // [blue[100], blue[600]],
        // [cyan[100], cyan[700]],
        // [green[100], green[700]],
        // [teal[100], teal[700]],
        // [deepPurple[100], deepPurple[600]],
        // [amber[100], amber[700]],
        // [deepOrange[100], deepOrange[700]],
        [theme.palette.primary.main, theme.palette.secondary.main]
    ];

    const randomIndex = Math.floor(Math.random() * colorOptions.length);
    return colorOptions[randomIndex];
};
