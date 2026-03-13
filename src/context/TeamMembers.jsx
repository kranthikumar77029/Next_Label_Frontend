import { createContext, useContext, useState, useEffect } from "react";
import { listMembersApi } from "@/networking/team_dashboard/teamapi";

const TeamMembersContext = createContext();

export const TeamMembersProvider = ({ children }) => {
  const [members, setMembers] = useState([]);

  const fetchMembers = async () => {
    const res = await listMembersApi();
    const data = res?.data?.data || res?.data || [];
    setMembers(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const annotators = members.filter(m => m.role === "annotator");
  const reviewers=members.filter(m=>m.role ==="reviewer");

  return (
    <TeamMembersContext.Provider value={{ members, annotators,reviewers, fetchMembers }}>
      {children}
    </TeamMembersContext.Provider>
  );
};

export const useTeamMembers = () => useContext(TeamMembersContext);
