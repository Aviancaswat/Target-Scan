import { Box, TextField } from "@mui/material"

const valueDefault = "Explicame Detalladamente el texto seleccionado para proporcionar contexto adicional."

export const InputSelectedText = ({ selectedText }: { selectedText: string }) => {

    return (
        <Box>
            <TextField
                label="Texto seleccionado"
                multiline
                fullWidth
                minRows={4}
                maxRows={10}
                value={selectedText}
                InputProps={{
                    readOnly: true,
                }}
            />
        </Box>
    )
        