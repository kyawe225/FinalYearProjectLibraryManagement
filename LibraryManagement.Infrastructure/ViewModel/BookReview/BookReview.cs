namespace MyLibraryManagement.Models
{
    
    /// <summary>
    /// Represents filter criteria for searching book reviews
    /// </summary>
    public class BookReviewFilter
    {
        /// <summary>
        /// Book ID to filter by
        /// </summary>
        public string BookId { get; set; }

        /// <summary>
        /// Member ID to filter by
        /// </summary>
        public string MemberId { get; set; }

        /// <summary>
        /// Rating to filter by (1-5)
        /// </summary>
        public int? Rating { get; set; }

        /// <summary>
        /// Start date for filtering by review date
        /// </summary>
        public string DateFrom { get; set; }

        /// <summary>
        /// End date for filtering by review date
        /// </summary>
        public string DateTo { get; set; }
    }
}