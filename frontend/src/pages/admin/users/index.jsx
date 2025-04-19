import React from "react";
import { useParams } from "react-router-dom";
import UserList from "./UserList";
import UserForm from "./UserForm";

const Users = () => {
  const { id } = useParams();

  if (id && id === "edit") return <UserForm />;
  else return <UserList />;
};

export default Users;
