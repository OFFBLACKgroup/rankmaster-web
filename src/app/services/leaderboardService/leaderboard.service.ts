import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private supabaseUrl = 'https://pubhndccqdwypcouejkh.supabase.co'
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1YmhuZGNjcWR3eXBjb3VlamtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk5NDg5ODQsImV4cCI6MjAzNTUyNDk4NH0.K4QZmJPYalq_PDk8JfPomQI_J9qT_UJ3vIaUXAmp2OU'
  public leaderboardChanges = new Subject<any>();
  private supabaseClient: SupabaseClient
  
  constructor() {
    this.supabaseClient = createClient(this.supabaseUrl, this.supabaseKey)

    this.supabaseClient
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'leaderboard'
      },
      (payload) => this.leaderboardChanges.next(payload)
    )
    .subscribe()
  }

  fetchLeaderboard() {
    return this.supabaseClient.from('leaderboard').select('*').order('total_points', { ascending: false })
  }
}