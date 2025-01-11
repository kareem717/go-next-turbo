"use client";

import { ReactNode, useState } from "react";
import { createContext, useContext } from "react";
import { Project } from "@repo/sdk";

export interface ProjectProviderProps {
  selectedProject: Project;
  setSelectedProject: (project: Project) => void;
  projects: Project[];
};

const ProjectContext = createContext<ProjectProviderProps | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }

  return context;
}

export function ProjectProvider({ children, projects, defaultProject }: { children: ReactNode, projects: Project[], defaultProject: Project }) {
  if (projects.length === 0) {
    throw new Error("ProjectProvider must be used with at least one project");
  }

  const [selectedProject, setSelectedProject] = useState<Project>(defaultProject);

  return (
    <ProjectContext.Provider value={{ selectedProject, projects, setSelectedProject }}>
      {children}
    </ProjectContext.Provider>
  );
}
