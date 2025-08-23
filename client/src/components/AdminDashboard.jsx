import React from "react";
import AdminContentForm from "./AdminContentForm";
import AdminMaterialForm from "./AdminMaterialForm";
// import SubjectForm from "./SubjectForm";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 space-y-10">
      {/* <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1> */}
      <AdminContentForm />
      <AdminMaterialForm />
    </div>
  );
};

export default AdminDashboard;
