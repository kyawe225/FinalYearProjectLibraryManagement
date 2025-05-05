import { Injectable } from '@angular/core';
import { Member, MemberCreate } from '../model/user';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ResponseModel } from '../model/response-model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = `${environment.apiUrl}/members`;

  constructor(private http: HttpClient) {}

  getMembers(): Observable<ResponseModel<Member[]>> {
    return this.http.get<ResponseModel<Member[]>>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching members', error);
        return of<ResponseModel<Member[]>>({ data : [] , message: 'Error fetching members',status: "failed" });
      })
    );
  }

  getMemberById(id: string): Observable<ResponseModel<Member | null>> {
    return this.http.get<ResponseModel<Member>>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching member with ID ${id}`, error);
        return of({data : null , message: `Error fetching member with ID ${id}`, status: "failed" });
      })
    );
  }

  createMember(member: MemberCreate): Observable<Member | null> {
    return this.http.post<Member>(this.apiUrl, member).pipe(
      catchError(error => {
        console.error('Error creating member', error);
        return of(null);
      })
    );
  }

  updateMember(id: string, member: MemberCreate): Observable<Member | null> {
    return this.http.put<Member>(`${this.apiUrl}/${id}`, member).pipe(
      catchError(error => {
        console.error(`Error updating member with ID ${id}`, error);
        return of(null);
      })
    );
  }

  deleteMember(id: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(error => {
        console.error(`Error deleting member with ID ${id}`, error);
        return of(false);
      })
    );
  }


  closeMemberAccount(id: string): Observable<boolean> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/close`, {}).pipe(
      map(() => true),
      catchError(error => {
        console.error(`Error closing member account with ID ${id}`, error);
        return of(false);
      })
    );
  }

  // This utility function formats the member data for table display
  formatMemberForDisplay(member: Member): any {
    return {
      ...member,
      fullName: `${member.first_name} ${member.last_name}`,
      membership_date: member.membership_date ? new Date(member.membership_date).toLocaleDateString() : '',
      membership_expiry: member.membership_expiry ? new Date(member.membership_expiry).toLocaleDateString() : '',
      date_of_birth: member.date_of_birth ? new Date(member.date_of_birth).toLocaleDateString() : ''
    };
  }
}
