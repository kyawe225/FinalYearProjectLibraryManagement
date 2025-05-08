using System;
using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.ViewModel.LibraryBranch;
using LibraryManagement.Infrastructure.ViewModel.User;

namespace LibraryManagement.Core.ViewModel.Appointment
{
    /// <summary>
    /// Represents an appointment in the library management system
    /// </summary>
    public class AppointmentViewModel
    {
        /// <summary>
        /// Unique identifier for the appointment
        /// </summary>
        public string AppointmentId { get; set; }

        /// <summary>
        /// ID of the member who made the appointment
        /// </summary>
        public string MemberId { get; set; }

        /// <summary>
        /// ID of the staff member associated with the appointment
        /// </summary>
        public string StaffId { get; set; }

        /// <summary>
        /// Date of the appointment
        /// </summary>
        public DateTime AppointmentDate { get; set; }

        /// <summary>
        /// Start time of the appointment
        /// </summary>
        public TimeSpan StartTime { get; set; }

        /// <summary>
        /// End time of the appointment
        /// </summary>
        public TimeSpan EndTime { get; set; }

        /// <summary>
        /// Purpose of the appointment
        /// </summary>
        public string Purpose { get; set; }

        /// <summary>
        /// Additional notes about the appointment
        /// </summary>
        public string Notes { get; set; }

        /// <summary>
        /// Current status of the appointment (Scheduled; Completed; Cancelled; No-Show; In Progress)
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        /// ID of the branch where the appointment will take place
        /// </summary>
        public string BranchId { get; set; }

        /// <summary>
        /// Date and time when the appointment was created
        /// </summary>
        public DateTime CreatedDate { get; set; }

        /// <summary>
        /// Date and time when the appointment was last modified
        /// </summary>
        public DateTime? ModifiedDate { get; set; }

        /// <summary>
        /// Navigation property for the staff member
        /// </summary>
        public virtual StaffViewModel? Staff { get; set; }

        /// <summary>
        /// Navigation property for the branch
        /// </summary>
        public virtual LibraryBranchViewModel? Branch { get; set; }

        public AppointmentViewModel(Core.Entities.Appointment appointment)
        {

            AppointmentId = appointment.AppointmentId;
            MemberId = appointment.MemberId;
            StaffId = appointment.StaffId;
            AppointmentDate = appointment.AppointmentDate.ToDateTime(TimeOnly.MinValue);
            StartTime = appointment.StartTime.ToTimeSpan();
            EndTime = appointment.EndTime.ToTimeSpan();
            Purpose = appointment.Purpose;
            Notes = appointment.Notes;
            Status = appointment.Status;
            BranchId = appointment.BranchId;
            CreatedDate = appointment.CreatedDate;
            ModifiedDate = appointment.ModifiedDate;
            // Optionally map nested view models if needed:
            if(appointment.Staff != null)
            Staff = new StaffViewModel(appointment.Staff);
            if(appointment.Branch != null)
            Branch = new LibraryBranchViewModel(appointment.Branch);
        }
    }
}