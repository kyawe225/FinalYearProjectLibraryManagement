
using LibraryManagement.Infrastructure.Context;

public interface IFeedbackRepository{
    public bool save(FeedbackCreateViewModel viewModel);
}

public class FeedbackRepository : IFeedbackRepository{
    private readonly LibraryManagementDbContext context;

    public FeedbackRepository(LibraryManagementDbContext context){
        this.context = context;
    }

     public bool save(FeedbackCreateViewModel viewModel){
        FeedbackTable feedback= viewModel.toFeedbackTable();
        this.context.Add(feedback);
        this.context.SaveChanges();
        return true;
     }
    
}