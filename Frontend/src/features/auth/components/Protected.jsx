import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react';
import LoadingState from "../../../components/LoadingState";

const Protected = ({ children }) => {
    const { loading, user } = useAuth();

    if (loading) {
        return <LoadingState title="Verifying Session" subtitle="Securely connecting your account..." steps={[]} />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

export default Protected;