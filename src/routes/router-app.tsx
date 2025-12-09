import ChatPage from "@/pages/chat.page";
import HomePage from "@/pages/home.page";
import { Route, Routes } from "react-router-dom";

const RoutesApp = () => {
    return (
        <Routes>
            <Route index path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="*" element={<HomePage />} />
        </Routes>
    );
};

export default RoutesApp;