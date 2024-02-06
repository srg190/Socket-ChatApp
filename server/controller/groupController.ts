import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../middleware/error";
import { StatusCodes } from "../constants/statuscode";
import { CustomRequest } from "../interface";

const prisma = new PrismaClient();

export const createGroup = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name }: { name: string } = req.body;

    if (!name) {
      return next(
        new ErrorHandler(
          "Please enter the name",
          StatusCodes.METHOD_NOT_ALLOWED
        )
      );
    }

    const group = await prisma.user.update({
      where: {
        id: req.user && req.user.id,
      },
      data: {
        groupAdmin: {
          create: [
            {
              name: name,
              users: {
                connect: {
                  id: req.user && req.user.id,
                },
              },
            },
          ],
        },
      },
      include: {
        groups: true,
      },
    });

    res.status(StatusCodes.CREATED).json({
      message: "Group created successful",
      success: true,
      data: { ...group, password: "" },
    });
  } catch (error) {
    return next(
      new ErrorHandler("Can not be created", StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
};

export const addInGroup = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      groupId,
      recipitantId,
    }: { groupId?: string; recipitantId?: string } = req.body;

    if (!groupId) {
      return next(
        new ErrorHandler("Please provide groupId", StatusCodes.BAD_REQUEST)
      );
    }

    if (!recipitantId) {
      return next(
        new ErrorHandler("Please provide recipitantId", StatusCodes.BAD_REQUEST)
      );
    }

    const recipitant = await prisma.user.findUnique({
      where: {
        id: recipitantId,
      },
    });

    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    const isAlreadyInGroup = group?.userIds.some((v) => v == recipitantId);
    if (isAlreadyInGroup) {
      return next(
        new ErrorHandler(
          "User already exist in this group",
          StatusCodes.METHOD_NOT_ALLOWED
        )
      );
    }

    if (req.user && group?.adminId !== req.user.id) {
      return next(
        new ErrorHandler(
          "You do not have permission to add in this group",
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    if (!recipitant) {
      return next(
        new ErrorHandler("Provided recipitant not found", StatusCodes.NOT_FOUND)
      );
    }

    const addOn = await prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        userIds: {
          push: recipitantId,
        },
      },
    });

    await prisma.user.update({
      where: {
        id: recipitantId,
      },
      data: {
        groupIds: {
          push: groupId,
        },
      },
    });

    if (!addOn) {
      return next(
        new ErrorHandler("Group not found or deleted", StatusCodes.BAD_REQUEST)
      );
    }

    res.status(StatusCodes.ACCEPTED).json({
      message: "Added successfully",
      success: true,
    });
  } catch (error) {
    return next(
      new ErrorHandler(
        "Internal server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const deleteGroup = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { groupId }: { groupId: string } = req.body;

    const data = await prisma.group.delete({
      where: {
        id: groupId,
      },
    });

    if (!data) {
      return next(
        new ErrorHandler(
          "Group is not found or already deleted",
          StatusCodes.NOT_FOUND
        )
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user && req.user.id,
      },
    });

    if (user) {
      const updatedGroupIds = user.groupIds.filter((id) => id !== groupId);

      await prisma.user.update({
        where: {
          id: req.user && req.user.id,
        },
        data: {
          groupIds: updatedGroupIds,
        },
      });
    }

    res.status(StatusCodes.ACCEPTED).json({
      message: "Group deleted successfully",
      success: true,
      data,
    });
  } catch (error) {
    return next(
      new ErrorHandler(
        "Internal server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const leaveGroup = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { groupId }: { groupId: string } = req.body;

    if (!groupId) {
      return next(
        new ErrorHandler("Please provide groupId", StatusCodes.BAD_REQUEST)
      );
    }

    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      return next(
        new ErrorHandler(
          "Please provide valid groupId or it not exist",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const userId = req.user && req.user.id;

    if (userId === group.adminId) {
      await deleteGroup(req, res, next);
    } else {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user && req.user.id,
        },
      });

      if (user) {
        const updatedGroupIds = user.groupIds.filter((id) => id !== groupId);

        await prisma.user.update({
          where: {
            id: req.user && req.user.id,
          },
          data: {
            groupIds: updatedGroupIds,
          },
        });
      }
    }

    res.status(StatusCodes.ACCEPTED).json({
      message: "Group deleted successfully",
      success: true,
    });
  } catch (error) {
    return next(
      new ErrorHandler(
        "Internal server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const getGroupDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { groupId, page = 1, pageSize = 30 } = req.body;

    if (!groupId) {
      return next(
        new ErrorHandler("Please provide groupId", StatusCodes.BAD_REQUEST)
      );
    }

    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            userName: true,
          },
        },
        messages: {
          take: pageSize,
          skip: (page - 1) * pageSize,
          orderBy: {
            createAt: "desc",
          },
          include: {
            sendBy: {
              select: {
                id: true,
                userName: true,
                email: true,
              },
            },
            sendTo: {
              select: {
                id: true,
                userName: true,
                email: true,
              },
            },
          },
        },
      },
    });
    
    const detail = { ...group, messages: group && group.messages.reverse() };
    if (!group) {
      return next(new ErrorHandler("Group not found", StatusCodes.NOT_FOUND));
    }
    res.status(StatusCodes.OK).json({
      message: "Fetch successfully",
      success: true,
      data: detail,
      page: page || 1,
      pageSize: pageSize || 30,
    });
  } catch (error) {
    return next(
      new ErrorHandler(
        "Internal server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const getGroupUsersList = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { groupId }: { groupId: string } = req.body;

    if (!groupId) {
      return next(
        new ErrorHandler("Please provide groupId", StatusCodes.BAD_REQUEST)
      );
    }

    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        users: {
          select: {
            id: true,
            userName: true,
            email: true,
          },
        },
      },
    });

    if (!group) {
      return next(new ErrorHandler("Group not found", StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({
      message: "Fetch successfully",
      success: true,
      data: group,
    });
  } catch (error) {
    return next(
      new ErrorHandler(
        "Internal server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};
