namespace LibraryManagement.Core;

public enum UserStatus
{
     Created,Active, Inactive , Banned , Closed
}

public enum UserType
{   
    Student , Employee, NonStudent
}

public enum RoleStatus
{
    Active, Inactive,Hidden
}

public enum BookStatus
{
    Active,Inactive
}

public enum BookConditionStatus
{
    Good, Excellent, Worn, Unrentable
}

public enum InventoryBookStatus
{
    Active , Inactive , Banned 
}

public enum ReservationStatus
{
    Created ,Accepted,  Retrieved, Finished
}

public enum NewsType {
    News, Event
}