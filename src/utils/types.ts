import type { LucideProps } from "lucide-react";
import React from "react";

export type LucideType = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;