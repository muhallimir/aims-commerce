import React from "react";
import MainLayout from "src/layouts/MainLayout";
import StartSellingForm from "src/forms/StartSellingForm";

const StartSellingPage: React.FC = () => {
    return (
        <MainLayout>
            <StartSellingForm />
        </MainLayout>
    );
};

export default StartSellingPage;
