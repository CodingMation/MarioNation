import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AddEditMaterial from "./AddEditMaterial";

const EditMaterial = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("marioNation");

  useEffect(() => {
      if (!token) return navigate('/login');
  }, [token])

  const { materialId } = useParams();

  if (!materialId) {
    return <p className="text-red-500">Invalid material context.</p>;
  }

  return <AddEditMaterial btnValue="edit" ID={materialId} context="material" />;
};

export default EditMaterial;