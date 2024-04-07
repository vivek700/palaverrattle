"use server";

import { z } from "zod";
import { auth } from "./auth";
import { db } from "./db";
import { fetchRedis } from "./redis";
import { validator } from "./validations/addFriend";

export const SendRequest = async (prevState: any, formData: FormData) => {
  //   console.log(formData);

  const validMail = validator.safeParse({
    email: formData.get("email"),
  });

  if (!validMail.success) {
    return {
      errors: validMail.error.flatten().fieldErrors,
      message: "Please enter a valid email.",
    };
  }

  const { email } = validMail.data;
  console.log(email);

  const RESTResponse = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email:${email}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      },
      cache: "no-store",
    }
  );
  const data = (await RESTResponse.json()) as { result: string };

  const idToAdd = data.result;

  const session = await auth();

  if (!session) {
    return {
      message: "unauthorized.",
    };
  }

  if (!idToAdd) {
    return {
      message: "Person does not exist.",
    };
  }

  if (idToAdd === session?.user.id) {
    return {
      message: "You can't add yourself.",
    };
  }

  //if user already added
  const isAdded = (await fetchRedis(
    "sismember",
    `user:${idToAdd}:friend_requests`,
    session?.user.id!
  )) as 0 | 1;

  if (isAdded) {
    return {
      message: "Already Added.",
    };
  }
  const isFriends = (await fetchRedis(
    "sismember",
    `user:${session?.user.id}:friends`,
    idToAdd
  )) as 0 | 1;

  if (isFriends) {
    return {
      message: "Already friends.",
    };
  }

  try {
    db.sadd(`user:${idToAdd}:friend_requests`, session?.user.id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        errors: error,
        message: "invaild request payload",
      };
    }
    return {
      message: "Invaild request.",
    };
  }

  return {
    message: "Friend request sent!",
  };
};
