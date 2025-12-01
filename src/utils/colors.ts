import { amber, indigo, lightBlue, lightGreen, orange, pink, purple, teal } from "@mui/material/colors";

export const getColor = () => {
    const colorOptions: [string, string][] = [
        [orange[100], orange[900]],
        [lightBlue[100], lightBlue[900]],
        [lightGreen[100], lightGreen[900]],
        [purple[100], purple[900]],
        [pink[100], pink[900]],
        [teal[100], teal[900]],
        [indigo[100], indigo[900]],
        [amber[100], amber[900]],
    ];

    const randomIndex = Math.floor(Math.random() * colorOptions.length);

    return colorOptions[randomIndex];
};
