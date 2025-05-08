
using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.Context;

public interface IFeedbackRepository{
    public bool save(FeedbackCreateViewModel viewModel);
}

public class FeedbackRepository : IFeedbackRepository{
    private readonly LibraryManagementContext context;

    public FeedbackRepository(LibraryManagementContext context){
        this.context = context;
    }

     public bool save(FeedbackCreateViewModel viewModel){
        FeedBack feedback= viewModel.toFeedbackTable();
        this.context.Add(feedback);
        this.context.SaveChanges();
        return true;
     }
    
}