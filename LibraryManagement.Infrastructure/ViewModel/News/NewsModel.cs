using System;
using LibraryManagement.Core;
using LibraryManagement.Core.Entity;

namespace LibraryManagement.Infrastructure.ViewModel.News;

public class NewsViewModel
{
    public string Id {set;get;}
    public DateTime createdAt {set;get;}
    public DateTime updatedAt {set;get;}
    public string title{set;get;}
    public string content {set;get;}
    public string userId {set;get;}
    public bool isPublish{set;get;} = false;
    public NewsType type {set;get;}

    public NewsViewModel(NewsTable table){
        title = table.title;
        content = table.content;
        userId = table.userId;
        Id = table.Id;
        createdAt = table.CreatedAt;
        updatedAt = table.UpdatedAt;
        isPublish = table.isPublish;
        type= table.type;
    }
}

public class NewsCreateViewModel {
    public string title{set;get;}
    public string content {set;get;}
    public string userId {set;get;}
    public bool isPublish{set;get;}
    public NewsType type {set;get;}
    public NewsTable toNewsTable(){
        NewsTable model = new NewsTable();
        model.title = title;
        model.content = content;
        model.userId = userId;
        model.isPublish = isPublish;
        return model;
    }
}
