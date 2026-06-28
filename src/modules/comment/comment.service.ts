import { prisma } from "../../lib/prisma";
import { ICreateCommentPayload } from "./comment.interface";

const createComment = async (
  payload: ICreateCommentPayload,
  userId: string,
) => {
  await prisma.post.findFirstOrThrow({
    where: {
      id: payload.postId,
    },
  });

  const result = await prisma.comment.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });
  return result;
};

const getCommentByAutorId = () => {};
const getCommentByCommentId = () => {};

const updateComment = () => {};
const deleteComment = () => {};
const moderateComment = () => {};

export const commentService = {
  createComment,
  getCommentByAutorId,
  getCommentByCommentId,
  updateComment,
  deleteComment,
  moderateComment,
};
