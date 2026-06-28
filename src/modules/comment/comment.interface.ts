import { CommentStatus } from "../../../generated/prisma/enums";

export interface IComment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  status: CommentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCommentPayload {
  content: string;
  postId: string;
}
