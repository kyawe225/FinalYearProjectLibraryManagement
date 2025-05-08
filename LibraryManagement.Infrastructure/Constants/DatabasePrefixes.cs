namespace LibraryManagement.Infrastructure.Constants;

        public struct DbPrefixes{
        // Book related prefixes
        public const string Book = "BK";
        public const string BookCopy = "CP";
        public const string Category = "CAT";
        public const string Publisher = "PUB";
        public const string Author = "AUTH";
        public const string BookAuthor = "BA";
        public const string BookReview = "REV";
        public const string Feedback = "FB";
        public const string News = "N";
        
        // Member related prefixes
        public const string Member = "MEM";
        
        // Loan and reservation related prefixes
        public const string BookLoan = "LOAN";
        public const string Reservation = "RES";
        public const string Fine = "FN";
        
        // Staff and branch related prefixes
        public const string Staff = "STF";
        public const string LibraryBranch = "BR";
        
        // Event related prefixes
        public const string Event = "EVT";
        public const string EventRegistration = "EREG";
        public const string Appointment = "APT";
        
        // Computer related prefixes
        public const string Computer = "PC";
        public const string ComputerSession = "SES";
        public const string ComputerReservation = "CRES";
        public const string WishBook = "WB";
}