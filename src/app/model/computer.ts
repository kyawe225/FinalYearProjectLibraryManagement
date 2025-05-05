// src/app/models/computer.model.ts

export interface Computer {
    computer_id: string;
    computer_name: string;
    branch_id: string;
    location_in_library?: string;
    computer_type: string;
    specifications?: string;
    operating_system?: string;
    installed_software?: string;
    acquisition_date?: string;
    last_maintenance_date?: string;
    status: string;
    time_limit_minutes: number;
    
    // For display purposes
    branch_name?: string;
  }
  
  export interface ComputerFilter {
    branch_id?: string;
    computer_type?: string;
    status?: string;
    search_term?: string;
  }