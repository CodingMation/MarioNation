import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import AddEditMaterial from './AddEditMaterial';

const AddMaterial = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("marioNation");

  useEffect(() => {
      if (!token) return navigate('/login');
  }, [token])

  const { exerciseId, chapterId, subjectId } = useParams();

  let ID = null;
  let context = null;

  if (exerciseId) {
    ID = exerciseId;
    context = "exercise";
  } else if (chapterId) {
    ID = chapterId;
    context = "chapter";
  } else if (subjectId) {
    ID = subjectId;
    context = "subject";
  }

  if (!ID || !context) {
    return <p className="text-red-500">Invalid material context.</p>;
  }

  return <AddEditMaterial btnValue="add" ID={ID} context={context} />;
};

export default AddMaterial;
