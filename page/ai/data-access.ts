import RedisServer from "../../service/redisService";

async function queryUserPromptCount(userID: string) {
  const count = await RedisServer.get(userID);
  if (!count) {
    await Promise.all([
      RedisServer.set(userID, 1),
      RedisServer.expireAt(userID, Date.now()),
    ]);
    return 1;
  }
  return count;
}
