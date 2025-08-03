import React from "react";
import MainLayout from "src/layouts/MainLayout";
import BecomeSellerForm from "src/forms/BecomeSellerForm";

const BecomeSellerPage: React.FC = () => {
    return (
        <MainLayout>
            <BecomeSellerForm />
        </MainLayout>
    );
};

export default BecomeSellerPage;
