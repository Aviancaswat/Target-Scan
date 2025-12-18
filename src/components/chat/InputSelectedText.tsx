import { Box, TextField } from "@mui/material"
import { useEffect, useState } from "react"

const valueDefault = "Explicame de manera sencilla el texto seleccionado."

export const InputSelectedText = ({ selectedText }: { selectedText: string }) => {
    const [hidden, setHidden] = useState(true)

    useEffect(() => {
        if (selectedText && selectedText.length > 0) {
            setHidden(false)
        }
    }, [selectedText])

    //detectar la posicion del cursor en el texto seleccionado 
    

    return (
        <Box display={hidden ? "none" : "block"} mt={2}>
            <TextField
                label="Texto seleccionado"
                multiline
                fullWidth
                minRows={4}
                maxRows={10}
                value={valueDefault}
            />
        </Box>
    )
}