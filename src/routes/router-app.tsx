import MaintenancePage from "@/components/maintenance/MaintenancePage";
import { Route, Routes } from "react-router-dom";

const RoutesApp = () => {
    return (
        <Routes>
            <Route index path="/" element={<MaintenancePage />} />
            {/* <Route path="/chat" element={<ChatPage />} />
            <Route path="*" element={<HomePage />} /> */}
        </Routes>
    );
};

export default RoutesApp;