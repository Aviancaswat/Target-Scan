import { Route, Routes } from "react-router-dom";
import ChatPage from "../pages/chat.page";
import HomePage from "../pages/home.page";

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