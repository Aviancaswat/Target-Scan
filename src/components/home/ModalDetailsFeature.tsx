import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { CircleX, Maximize2 } from 'lucide-react';
import * as React from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    minWidth: 320,
    maxWidth: "100%",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 5
};

interface ModalDetailsFeatureProps {
    type: 1 | 2 | 3;
}

type dataFeatureType = {
    title: string,
    description: string[]
}

const dataFeature: dataFeatureType[] = [
    {
        title: "Análisis de requerimientos",
        description: [
            "Verificación de que el desarrollo responde exactamente al requerimiento funcional descrito.",
            "Identificación de escenarios obligatorios para Desarrollo(lógica, flujos, condiciones) y para QA(casos de prueba, validaciones negativas y límites).",
            "Detección de posibles ambigüedades, dependencias y riesgos que puedan impactar la experiencia o el negocio.",
            "Generación de criterios de aceptación claros y accionables para todo el equipo."
        ]
    },
    {
        title: "Análisis visual (UI / Figma vs implementación)",
        description: [
            "Comparación de la interfaz implementada frente al diseño en Figma: layout, estructura y jerarquía de componentes.",
            "Revisión de colores, tipografías, tamaños, espaciados, bordes, iconografía y estados (hover, active, disabled, errores, etc.).",
            "Verificación de comportamiento responsive en distintos breakpoints (móvil, tablet, desktop).",
            "Señalamiento de desviaciones visuales o inconsistencias con la guía de diseño, junto con recomendaciones para corregirlas."
        ]
    },
    {
        title: "Análisis técnico (código y buenas prácticas)",
        description: [
            "Validación de que el código cumple con los estándares definidos",
            "Revisión de modularidad y legibilidad: funciones pequeñas, nombres descriptivos, separación de responsabilidades y ausencia de “monolitos” de código.",
            "Evaluación de performance y mantenibilidad: uso adecuado de listeners, timers, condiciones y estructuras de datos.",
            "Recomendaciones concretas para mejorar calidad, reducir deuda técnica y facilitar la automatización de pruebas."
        ]
    }
]

export default function ModalDetailsFeature(props: ModalDetailsFeatureProps) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <IconButton
                sx={{ background: "#fff", color: "#000" }}
                onClick={handleOpen}
            >
                <Maximize2 />
            </IconButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={(theme) => ({
                    ...style,
                    backgroundColor: "primary.main",
                    backgroundImage: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, rgba(255,255,255,1) 50%)`
                })}>
                    <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                    >
                        <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight={"bold"}>
                            {dataFeature[props.type - 1].title}
                        </Typography>
                        <IconButton onClick={handleClose} sx={{ background: "#fff", color: "#000" }}>
                            <CircleX />
                        </IconButton>
                    </Box>
                    <Typography id="modal-modal-description" sx={{ mt: 2, p: 1 }} >
                        {
                            dataFeature[props.type - 1].description.map(e => (
                                <li>{e}</li>
                            ))
                        }
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}
