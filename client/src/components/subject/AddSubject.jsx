import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddEdit from "./AddEdit";

const AddSubject = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("marioNation");

    useEffect(() => {
    }, [token])

    return (
        <div>
            <AddEdit btnValue="add" />
        </div>
    );
};

export default AddSubject;
