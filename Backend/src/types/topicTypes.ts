export interface TopicCreateInput {
  user_id: number;
  title: string;
  description?: string | undefined;
}

export interface TopicUpdateInput {
  title?: string;
  description?: string;
}

export interface TopicWithUser {
  id: number;
  user_id: number;
  title: string;
  description: string;
  difficulty: string;
  created_at: string;
  username: string;
  email: string;
}
